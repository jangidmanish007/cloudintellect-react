const IMAGE_SRC = '/images/Section (8).webp'

function CommunityImageSection() {
  return (
    <section className="community-image-section" aria-label="Community">
      <div className="community-image-wrap">
        <img
          src={encodeURI(IMAGE_SRC)}
          alt="Students and community at Cloud Intellect"
          className="community-image"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  )
}

export default CommunityImageSection
