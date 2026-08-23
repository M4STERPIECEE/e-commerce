'use client';

import Image from 'next/image';

export function HeroSection({ onExploreClick }: { onExploreClick?: () => void }) {
    const handleExplore = () => {
        if (onExploreClick) {
            onExploreClick();
        } else {
            const el = document.getElementById('featured-section') || document.getElementById('catalogue');
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <section className="min-h-[80vh] flex flex-col lg:flex-row items-center px-margin-mobile md:px-margin-desktop py-16 gap-gutter">
            {/* Left Content */}
            <div className="flex-1 flex flex-col items-start gap-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-outline-variant/50 shadow-sm">
                    <div className="flex -space-x-2">
                        <Image
                            className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover"
                            alt="A small circular avatar of a modern professional, well lit studio shot."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvSIoqCIPUFvBYGq5mZABVhWSEUB21burcri3WdKi2rVTDmjtyrExe5KEXdGGsw2N1ywCHVfQfjfYnjLjQog-RVtPUyZaaLpcukJGhP_2jBWEhzNDVT4OvPDtADw3dhMUp3Yfb6HyYhfjbXKKdL-jDuj3TsWli4pFciYUmkpFICNqVNCRa6pVPJZ2R2VcOQ0Z_oCroul-nxfSgBRuHhDV7F0nhB2KpmidIfBkQpQCkWbcaOZN1JTdoAA"
                            width={24}
                            height={24}
                        />
                        <Image
                            className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover"
                            alt="A small circular avatar of an elegant woman, high fashion photography."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAf3MdLEdhfEPX6qC4h89vW_KuIXJ_XocWRZuapX_oSii04buP-Q8CAV56698aQgLOep_Fg11hcrWdIfmBrU21LHY8KTkIjOAhKnHmiqWtCrFG_aelnsyseBfhZ5laRLSX5A4Np1v1_a9UYa8Jb44FXxAefIgNPzsIXi7kKmkTaHOEOsPdMCYRoEV1ypWuaMGBKQtCu4Gsif3P4liuu1Vx2ZchLL_r-kD6eJAIXv3cwogMwro6WZgul3g"
                            width={24}
                            height={24}
                        />
                        <Image
                            className="w-6 h-6 rounded-full border-2 border-surface-container-lowest object-cover"
                            alt="A small circular avatar of a smiling man, clean background."
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPEc-8x3EVkTgmFgd0taKH2ODiW4B8f4FR-hgeVMFD90T64eMfgkorgAtYiIbhoKIqhtMVGA_L8gV-VPyW8MQ8TXZb_vs4gu1gpdfqKJzd4R-wWLZKVzUwP2dVJjUup3W0eTOEJu4Xxer2yySq7lcC8j8tC8udMRYIE9QU32dFFFcg1x38rB6X6YjLSQfLv7PC8ZzPEaG30uQ7q1LVi5OQxzbzjYYv75VHz26B9DwSti_N5uNqFpFSJw"
                            width={24}
                            height={24}
                        />
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                        </span>
                    </div>
                    <span className="font-label-caps text-label-caps text-secondary ml-1">
                        Rated 4.9/5 by 10,000+ customers
                    </span>
                </div>

                <h1 className="font-display-lg text-4xl sm:text-display-lg text-primary max-w-2xl leading-tight font-bold tracking-tight">
                    Curated essentials for modern life
                </h1>
                <p className="font-body-lg text-body-lg text-secondary max-w-xl">
                    Elevate your daily routine with meticulously designed products that blend minimalist aesthetics with uncompromising utility.
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-4">
                    <button
                        onClick={handleExplore}
                        className="shimmer-btn bg-primary text-on-primary font-button text-button px-6 py-3 rounded hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                    >
                        Explore Collection
                    </button>
                    <button
                        onClick={handleExplore}
                        className="bg-surface-container-lowest text-primary font-button text-button px-6 py-3 rounded border border-outline-variant hover:bg-surface-container-low transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]" data-icon="play_circle">play_circle</span>
                        Watch Lookbook
                    </button>
                </div>
            </div>

            {/* Right Showcase */}
            <div className="flex-1 relative w-full aspect-square max-w-[600px] mt-12 lg:mt-0">
                {/* Main Card */}
                <div className="absolute inset-0 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xl overflow-hidden group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDU3muegKP3JojvjZlLxu1kmrZZaWNQj8wJoHwuSW1WrdADlQU90mRZxSPA5Q0Jrpqw09D_TD91pg2M8RQJFdJYs3kM7MH_1v8RVa8ZYU-DQNx33Zogu-g-jt0OqWmjvEXyqMMqdoKhXAOWW6fbEaeynhh3Iz-f_xNl7J3vcIoLqRP3PnCWghMN_rjGa9ga9WH7HrJ7GGaawI6ojvDIZ8nwoloGXfxG5PEbZJKLICnkeIu5UCGKZBJGJQ')" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Floating Chips */}
                <div className="absolute top-8 -left-6 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]" data-icon="auto_awesome">auto_awesome</span>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">Top Rated</span>
                </div>
                <div className="absolute bottom-16 -right-4 bg-tertiary text-on-tertiary px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2">
                    <span className="font-button text-button font-bold text-white">$129</span>
                </div>
                <div className="absolute top-1/2 -right-8 bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="font-label-caps text-label-caps text-primary font-semibold">In Stock</span>
                </div>
            </div>
        </section>
    );
}
