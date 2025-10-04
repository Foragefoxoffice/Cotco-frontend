import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getPrivacyPage } from "../../Api/api";

const API_BASE = import.meta.env.VITE_API_URL;

const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE}${path}`;
};

const HeroSection = () => {
    const [scrolled, setScrolled] = useState(false);
    const [banner, setBanner] = useState(null);
    const containerRef = useRef(null);

    // ✅ Fetch privacy banner
    useEffect(() => {
        getPrivacyPage().then((res) => {
            if (res.data?.privacyBanner) {
                setBanner(res.data.privacyBanner);
            }
        });
    }, []);

    // ✅ scroll shrink effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // ✅ Parallax setup
    const { scrollY } = useScroll();
    const yImage = useTransform(scrollY, [0, 500], [0, 0]);
    const yTitle = useTransform(scrollY, [0, 300], [0, -50]);

    // ✅ Check if media is video
    const isVideo = banner?.privacyBannerMedia
        ? /\.(mp4|webm|ogg)$/i.test(banner.privacyBannerMedia)
        : false;

    return (
        <motion.div
            ref={containerRef}
            style={{ y: yImage }}
            initial={{ scale: 1, opacity: 1 }}
            animate={
                scrolled ? { scale: 0.93, opacity: 0.95 } : { scale: 1, opacity: 1 }
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative h-[90vh] rounded-br-2xl overflow-hidden hero transition-all duration-500 ease-out ${scrolled ? "rounded-2xl" : ""
                }`}
        >
            {/* ✅ Background video or image */}
            {isVideo ? (
                <video
                    src={getFullUrl(banner?.privacyBannerMedia)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                />
            ) : (
                <div
                    className="absolute inset-0 w-full h-full bg-center bg-cover"
                    style={{
                        backgroundImage: banner?.privacyBannerMedia
                            ? `url('${getFullUrl(banner.privacyBannerMedia)}')`
                            : "url('/img/cotton/banner.jpg')", // fallback
                    }}
                />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/20 z-10" />

            {/* Title */}
            <motion.h3
                style={{ y: yTitle }}
                className="text-4xl z-20 absolute bottom-24 left-24 text-[#fff] md:text-6xl font-bold tracking-wider uppercase"
            >
                {banner?.privacyBannerTitle?.en || "PRIVACY POLICY"}
            </motion.h3>
        </motion.div>
    );
};

export default HeroSection;
