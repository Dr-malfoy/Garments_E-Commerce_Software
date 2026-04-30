import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OfferCarousel = () => {
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const response = await axios.get('/api/public/banners');
            setBanners(response.data);
        } catch (error) {
            console.error('Failed to fetch banners', error);
        } finally {
            setLoading(false);
        }
    };

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
    };

    useEffect(() => {
        if (banners.length > 0) {
            const timer = setInterval(nextSlide, 5000);
            return () => clearInterval(timer);
        }
    }, [banners.length]);

    if (loading || banners.length === 0) return null;

    // We need at least 3 banners for the effect. If not, we'll duplicate them.
    const displayBanners = banners.length < 3 ? [...banners, ...banners, ...banners] : banners;

    const getSlideIndex = (offset) => {
        return (currentIndex + offset + displayBanners.length) % displayBanners.length;
    };

    const indices = [-1, 0, 1]; // Left, Center, Right

    return (
        <div className="relative w-full overflow-hidden py-20 bg-transparent">
            <div className="relative max-w-[1600px] mx-auto h-[500px] md:h-[600px] flex items-center justify-center">
                
                {indices.map((offset) => {
                    const banner = displayBanners[getSlideIndex(offset)];
                    const isCenter = offset === 0;
                    
                    return (
                        <div
                            key={`${banner.id}-${offset}`}
                            className={`absolute transition-all duration-700 ease-out cursor-pointer flex items-center justify-center
                                ${isCenter ? 'z-30 w-[70%] md:w-[28%] h-[80%] opacity-100 scale-100 blur-0' : 
                                  offset === -1 ? 'z-10 w-[55%] md:w-[22%] h-[60%] opacity-60 scale-90 blur-[6px] -translate-x-[75%] md:-translate-x-[110%]' : 
                                  'z-10 w-[55%] md:w-[22%] h-[60%] opacity-60 scale-90 blur-[6px] translate-x-[75%] md:translate-x-[110%]'
                                }
                            `}
                            onClick={() => offset !== 0 && (offset === -1 ? prevSlide() : nextSlide())}
                        >
                            <div className="relative w-full h-full rounded-[40px] overflow-hidden shadow-2xl border border-white/10">
                                <img 
                                    src={`/storage/${banner.image}`} 
                                    className="w-full h-full object-cover"
                                    alt={banner.title} 
                                />
                                {isCenter && (
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
                                        <h3 className="text-2xl md:text-4xl font-black text-white tracking-tighter leading-tight mb-4">
                                            {banner.title}
                                        </h3>
                                        {banner.link && (
                                            <a 
                                                href={banner.link}
                                                className="inline-block w-fit px-8 py-4 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-[#f53003] hover:text-white transition-all"
                                            >
                                                Claim Offer
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Navigation Controls */}
                <button 
                    onClick={prevSlide}
                    className="absolute left-4 md:left-10 z-40 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all group"
                >
                    <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute right-4 md:right-10 z-40 p-4 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all group"
                >
                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mt-12">
                {banners.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`transition-all duration-300 rounded-full h-1.5 ${i === currentIndex ? 'bg-[#f53003] w-12' : 'bg-black/10 w-3 hover:bg-black/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default OfferCarousel;
