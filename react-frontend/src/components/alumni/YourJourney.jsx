"use client";
import Link from "next/link";

export default function YourJourney() {
  return (
    <section className="bg-white py-20 px-4 md:py-[60px] md:px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-[#F8FAFC] border border-[#0000001A] rounded-[32px] md:rounded-3xl md:py-16 py-8 px-6 flex flex-col align-items-center justify-contet-center text-center">

          <h2 className="text-black text-[24px] md:text-[34px] font-bold leading-[1.2] m-0 mb-6">
            Your Journey Can Start Here
          </h2>

          <p className="ranade-font text-[#1E1E1E] text-base md:text-lg  font-normal leading-relaxed m-0 mb-6 max-w-[700px] mx-auto">
            You don’t need a perfect background. You don’t need years of experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-8 bg-white border border-[#0000001A] rounded-lg py-4 px-6 w-fit mx-auto mb-4">
            <div className="flex justify-center items-center gap-3">
              <div className="h-[24px] w-[24px] object-cover"><img src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/alumni/psychology.webp`} alt="" /></div>
              <p className="mb-0 text-black font-medium text-md">The right learning path</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <div className="h-[24px] w-[24px] object-cover"><img src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/alumni/sensor_occupied.webp`} alt="" /></div>
              <p className="mb-0 text-black font-medium text-md">Practical exposure</p>
            </div>
            <div className="flex justify-center items-center gap-3">
              <div className="h-[24px] w-[24px] object-cover"><img src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/alumni/airline_stops.webp`} alt="" /></div>
              <p className="mb-0 text-black font-medium text-md">Honest guidance</p>
            </div>
          </div>

          <p className="ranade-font text-[#1E1E1E] text-base font-normal leading-relaxed m-0 mb-8 max-w-[700px] mx-auto">
            That’s how these careers were built. Yours can be next.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <a className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-[#009FFF] text-white text-base font-semibold no-underline transition-all duration-200 hover:bg-[#0088e6] hover:-translate-y-0.5" href="#">
              Explore Programs<span aria-hidden="true">→</span>
            </a>
            <a className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-white text-[#000000] text-base font-semibold no-underline transition-all duration-200 hover:bg-white/90 hover:-translate-y-0.5" href="#">
              View Placements</a>
          </div>
        </div>
      </div>
    </section>
  );
}
