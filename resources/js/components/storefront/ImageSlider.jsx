import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ImageSlider = () => {
    const [activeSlide, setActiveSlide] = useState(0);
    const [banners, setBanners] = useState([]);
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

    useEffect(() => {
        if (banners.length > 0) {
            const timer = setInterval(() => {
                setActiveSlide((prev) => (prev + 1) % banners.length);
            }, 4000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    if (loading || banners.length === 0) return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-[40vh] rounded-sm overflow-hidden bg-[#fff2f2] animate-pulse flex items-center justify-center">
                    <p className="text-[#2563eb] font-bold text-xs uppercase tracking-widest">Loading Current Offers...</p>
                </div>
            </div>
        </section>
    );

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative h-[40vh] rounded-sm overflow-hidden shadow-sm group">
                    {banners.map((banner, index) => (
                        <div 
                            key={banner.id}
                            className={`absolute inset-0 w-full h-full transition-all duration-1000 transform ${index === activeSlide ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                        >
                            <img src={`/storage/${banner.image}`} className="w-full h-full object-cover" alt={banner.title} />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-12">
                                <div className="space-y-3">
                                    <h3 className="text-4xl font-bold tracking-tighter text-white drop-shadow-lg">{banner.title}</h3>
                                    {banner.link && (
                                        <a href={banner.link} className="inline-block px-6 py-2.5 bg-white text-[#1b1b18] font-bold text-[10px] uppercase tracking-widest rounded-sm hover:bg-[#2563eb] hover:text-white transition-all shadow-lg">
                                            View Offer
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {/* Dots */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {banners.map((_, i) => (
                            <div 
                                key={i} 
                                onClick={() => setActiveSlide(i)}
                                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${i === activeSlide ? 'bg-white w-6' : 'bg-white/30'}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImageSlider;
