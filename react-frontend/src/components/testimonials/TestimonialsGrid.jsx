'use client';

import { useState, useEffect, useCallback } from "react";

// ─── YouTube helpers ──────────────────────────────────────────────────────────

const getYouTubeVideoId = (url) => {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{10,12})(?:[?#&]|$)/);
  if (shortMatch) return shortMatch[1];

  const embedMatch = trimmed.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{10,12})(?:[?#&]|$)/);
  if (embedMatch) return embedMatch[1];

  const watchMatch = trimmed.match(/(?:youtube\.com\/watch\?)(?:.*&)?v=([a-zA-Z0-9_-]{10,12})(?:[&]|$)/);
  if (watchMatch) return watchMatch[1];

  try {
    const u = new URL(trimmed);
    if (u.hostname.replace(/^www\./, "") === "youtube.com" && u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }
    if (u.hostname === "youtu.be" && u.pathname.slice(1)) {
      return u.pathname.slice(1).split(/[?#&]/)[0];
    }
  } catch (_) { }

  return null;
};

const getYouTubeThumbnail = (videoId) =>
  videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

// ─── Image URL resolver ───────────────────────────────────────────────────────

// ─── Card background colours (cycling) ───────────────────────────────────────

const BG_COLORS = ["#E5E7EB", "#BFDBFE", "#FBCFE8", "#FDE68A", "#C7D2FE", "#A7F3D0"];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TestimonialsGrid({ testimonials = [], pageData }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Section heading from CMS
  const sectionContent = pageData?.content?.testimonialsSection || {};
  const sectionTitle = sectionContent.heading || sectionContent.title || "Alumni Spotlights";

  // ── Video modal handlers ──────────────────────────────────────────────────

  const closeVideoModal = useCallback(() => setSelectedVideo(null), []);

  const handleVideoClick = (testimonial) => {
    if (!testimonial.videoUrl) return;
    const videoId = getYouTubeVideoId(testimonial.videoUrl);
    if (videoId) {
      setSelectedVideo({ type: "youtube", id: videoId });
    } else {
      const isYoutube = /youtube\.com|youtu\.be/i.test(testimonial.videoUrl);
      if (isYoutube) {
        const fallbackId = (
          testimonial.videoUrl.match(/[?&]v=([a-zA-Z0-9_-]{10,12})/) ||
          testimonial.videoUrl.match(/youtu\.be\/([a-zA-Z0-9_-]{10,12})/)
        )?.[1];
        setSelectedVideo(
          fallbackId
            ? { type: "youtube", id: fallbackId }
            : { type: "embed", url: testimonial.videoUrl }
        );
      } else {
        setSelectedVideo({ type: "embed", url: testimonial.videoUrl });
      }
    }
  };

  // Lock body scroll + Escape key when modal is open
  useEffect(() => {
    if (!selectedVideo) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e) => { if (e.key === "Escape") closeVideoModal(); };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedVideo, closeVideoModal]);

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!testimonials.length) {
    return (
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-center py-16 px-5 text-[#64748b] text-lg">
            No testimonials available at the moment.
          </p>
        </div>
      </section>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Section ── */}
      <section className="py-20 px-6 bg-white md:py-[60px] md:px-5">
        <div className="max-w-[1280px] mx-auto">

          {/* Section title */}
          <h2 className="text-[#1E1E1E] lg:text-[48px] md:text-[36px] sm:text-[28px] text-[28px] font-bold mb-4 md:mb-[60px] md:mb-10 leading-tight">
            {sectionTitle}
          </h2>
          <div className="grid grid-cols-1 xl:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-6 md:gap-5 mt-10">
            {testimonials.map((testimonial, index) => {
              const videoId = testimonial.videoUrl
                ? getYouTubeVideoId(testimonial.videoUrl)
                : null;
              const thumbnailUrl = testimonial.coverPhoto
                ? testimonial.coverPhoto
                : videoId
                  ? getYouTubeThumbnail(videoId)
                  : testimonial.image
                    ? testimonial.image
                    : null;
              const hasVideo = !!testimonial.videoUrl;
              const bgColor = BG_COLORS[index % BG_COLORS.length];

              return (
                <div
                  key={testimonial._id}
                  className="bg-white rounded-[20px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out flex flex-col h-full hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)]"
                >
                  {/* Image wrapper */}
                  <div
                    className={[
                      "relative w-full h-full min-h-[450px] md:min-h-[500px] max-h-[540px] overflow-hidden flex flex-col group",
                      hasVideo ? "cursor-pointer" : "cursor-default",
                    ].join(" ")}
                    onClick={() => hasVideo && handleVideoClick(testimonial)}
                    style={{ backgroundColor: bgColor }}
                  >
                    {/* Thumbnail */}
                    {thumbnailUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumbnailUrl}
                        alt={testimonial.name}
                        loading="lazy"
                        className="w-full h-full object-cover object-bottom block"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    )}

                    {/* Play button */}
                    {hasVideo && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[3] pointer-events-none transition-transform duration-300 ease-in-out group-hover:scale-110">
                        <svg
                          width="80"
                          height="80"
                          viewBox="0 0 80 80"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="sm:w-[60px] sm:h-[60px]"
                        >
                          <circle cx="40" cy="40" r="40" fill="rgba(255,255,255,0.9)" />
                          <circle cx="40" cy="40" r="38" stroke="rgba(0,0,0,0.2)" strokeWidth="2" />
                          <path d="M32 26L32 54L54 40L32 26Z" fill="#1E1E1E" />
                        </svg>
                      </div>
                    )}

                    {/* Specialization badge */}
                    {(testimonial.specialization || testimonial.program) && (
                      <div className="absolute top-4 right-4 z-[3] bg-white/10 backdrop-blur-sm px-[10px] py-[10px] rounded-[4px] text-white text-[11px] font-semibold uppercase tracking-[0.5px]">
                        {testimonial.specialization || testimonial.program}
                      </div>
                    )}

                    {/* Gradient overlay with name / role / company */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[30%] z-[2] flex items-end p-6"
                      style={{
                        background: "linear-gradient(180deg, rgba(11,28,51,0.00) 50%, #0B1C33 100%)",
                      }}
                    >
                      <div className="w-full flex flex-col gap-2">
                        <h3 className="text-white text-[20px] sm:text-[24px] font-medium m-0 leading-[1.2]">
                          {testimonial.name}
                        </h3>
                        {testimonial.role && (
                          <p className="text-white text-[14px] sm:text-[10px] font-normal m-0">
                            {testimonial.role}
                          </p>
                        )}
                        {testimonial.company && (
                          <span className="inline-block bg-white text-[#1E1E1E] py-2 px-3 rounded-sm text-[12px] leading-[14px] font-medium uppercase tracking-[0.5px] w-fit shadow-[0_2px_8px_rgba(0,0,0,0.15)]">
                            {testimonial.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Video modal — always in-page, never redirect to YouTube ── */}
      {selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-[10000] flex items-center justify-center p-5"
          onClick={closeVideoModal}
          role="dialog"
          aria-modal="true"
          aria-label="Testimonial video"
        >
          <div
            className="relative w-full max-w-[1200px] aspect-video bg-black rounded-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              className="absolute -top-10 right-0 bg-transparent border-none text-white text-[36px] cursor-pointer w-10 h-10 flex items-center justify-center z-[10001] transition-opacity duration-200 hover:opacity-70"
              onClick={closeVideoModal}
              aria-label="Close video"
            >
              ×
            </button>

            {/* Embed */}
            <div className="w-full h-full">
              {selectedVideo.type === "youtube" ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Testimonial Video"
                />
              ) : !/youtube\.com|youtu\.be/i.test(selectedVideo.url) ? (
                <iframe
                  width="100%"
                  height="100%"
                  src={selectedVideo.url}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title="Testimonial Video"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full p-6 text-center text-[#94a3b8] text-base">
                  <p>
                    This video could not be loaded. Please check the video link
                    format (use a standard YouTube or youtu.be URL).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
