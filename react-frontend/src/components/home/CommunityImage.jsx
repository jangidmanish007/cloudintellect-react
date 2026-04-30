import React from 'react';
import Image from 'next/image';

export default function CommunityImage() {
  return (
    <section aria-label="Community" className="w-full m-0 p-0 bg-white overflow-hidden">
      <div className="w-full m-0 p-0 overflow-hidden">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMG_PATH}images/home/community-section.webp`}
          alt="Students and community at Cloud Intellect"
          width={1920}
          height={800}
          className="w-full h-auto block m-0 p-0 object-cover object-center align-middle"
          loading="lazy"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
