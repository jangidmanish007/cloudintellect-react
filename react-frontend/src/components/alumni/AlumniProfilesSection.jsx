'use client';
import Image from "next/image";

export default function AlumniProfilesSection({ alumniProfile = [], pageData }) {

    if (!alumniProfile.length) return null;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 md:px-0">
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {alumniProfile.map((item) => (
                        <div
                            key={item._id}
                            className="bg-[#f5f5f5] border border-gray-200 rounded-2xl p-6 max-w-sm w-full"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12">
                                    <Image
                                        src={process.env.DYNAMIC_IMG_BASE_PATH + item.image}
                                        alt={item.name}
                                        fill
                                        className="rounded-full object-cover"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {item.name}
                                    </h3>
                                    <p className="font-rannade text-xs text-black">
                                        {item.company}
                                    </p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <span className="font-rannade text-[10px] font-semibold text-[#0ea5e9] border border-[#0000001A] text-[#009DE3] px-3 py-2 rounded-full tracking-wide uppercase">
                                    {item.specialization}
                                </span>
                            </div>

                            <p className="font-rannade text-[14px] text-black leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}