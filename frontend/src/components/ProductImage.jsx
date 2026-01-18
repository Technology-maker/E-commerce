import React, { useState, useRef, useEffect } from 'react';

const ProductImage = ({ images = [] }) => {
    const [mainImg, setMainImg] = useState(images[0]?.url || '');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const mainImageRef = useRef(null);
    const thumbnailContainerRef = useRef(null);

    // Handle image selection
    const handleImageSelect = (index) => {
        setSelectedIndex(index);
        setMainImg(images[index].url);

        // Scroll thumbnails on mobile
        if (thumbnailContainerRef.current) {
            const thumbnail = thumbnailContainerRef.current.children[index];
            thumbnail?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    // Zoom functionality
    const handleMouseMove = (e) => {
        if (!mainImageRef.current) return;

        const rect = mainImageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        setZoomPosition({ x, y });
    };

    // Keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                const newIndex = selectedIndex === 0 ? images.length - 1 : selectedIndex - 1;
                handleImageSelect(newIndex);
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                const newIndex = selectedIndex === images.length - 1 ? 0 : selectedIndex + 1;
                handleImageSelect(newIndex);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [selectedIndex, images.length]);

    if (!images.length) {
        return (
            <div className="flex items-center justify-center w-full bg-gray-100 rounded-lg h-96">
                <p className="text-gray-500">No images available</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Main Image Container */}
            <div className="flex flex-col-reverse md:flex-row gap-3 md:gap-6 w-full">

                {/* Thumbnails - Horizontal on mobile, vertical on desktop */}
                <div
                    ref={thumbnailContainerRef}
                    className="flex md:flex-col gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible md:w-auto w-full pb-2 md:pb-0"
                >
                    {images.map((img, index) => (
                        <button
                            key={img._id}
                            onClick={() => handleImageSelect(index)}
                            className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer hover:border-gray-400 ${selectedIndex === index
                                    ? 'border-blue-500 shadow-md'
                                    : 'border-gray-200 hover:shadow-md'
                                }`}
                            aria-label={`View product image ${index + 1}`}
                        >
                            <img
                                src={img.url}
                                alt={`Product thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>

                {/* Main Image */}
                <div className="w-full flex items-center justify-center relative">
                    <div
                        className="relative w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
                        style={{
                            aspectRatio: '1',
                            maxWidth: '100%',
                        }}
                        onMouseEnter={() => setIsZoomed(true)}
                        onMouseLeave={() => setIsZoomed(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            ref={mainImageRef}
                            src={mainImg}
                            alt="Product main image"
                            className={`w-full h-full object-contain transition-transform duration-300 ${isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                                }`}
                            style={isZoomed ? {
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            } : {}}
                            loading="lazy"
                        />

                        {/* Zoom indicator for desktop */}
                        {isZoomed && (
                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                                Scroll to zoom
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Image Counter - Mobile only */}
            <div className="mt-3 md:hidden flex justify-center">
                <span className="text-sm text-gray-600">
                    {selectedIndex + 1} of {images.length}
                </span>
            </div>
        </div>
    );
};

export default ProductImage;
