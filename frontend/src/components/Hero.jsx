import { useNavigate } from "react-router-dom";
import heroImg from "../assets/heroImg/front-view-woman-holing-tablet-shopping-bags.jpg";
import { Button } from "./ui/button";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-muted via-background to-muted">
            {/* Background blobs */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-10 left-6 sm:top-20 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-10 right-6 sm:bottom-20 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 rounded-full blur-3xl animate-float" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10 justify-center">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* TEXT */}
                    <div className="text-center lg:text-left order-1">
                        <span className="inline-block px-4 py-2 rounded-full  text-xs sm:text-sm font-medium mb-5 ">
                            New Collection 2026
                        </span>

                        <h1 className="font-heading font-bold leading-tight mb-6 animate-fade-up stagger-1  text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                            Elevate Your
                            <span className="block text-gradient">Everyday Style</span>
                        </h1>

                        <p className="text-muted-foreground leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0text-base sm:text-lg md:text-xl animate-fade-up stagger-2">
                            Discover our curated collection of premium fashion pieces, crafted for those who
                            appreciate timeless elegance and modern sophistication.
                        </p>

                        {/* STATS */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10 mt-10 pt-8 border-t border-border animate-fade-up stagger-4">
                            {[
                                { value: "50K+", label: "Happy Customers" },
                                { value: "200+", label: "Premium Brands" },
                                { value: "4.9", label: "Customer Rating" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center lg:text-left">
                                    <div className="font-heading text-xl sm:text-2xl md:text-3xl font-bold">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs sm:text-sm text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* IMAGE */}
                    <div className="relative order-2 lg:order-2 animate-scale-in stagger-2">
                        <div className="relative max-w-sm sm:max-w-md mx-auto">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl rotate-3 scale-95" />

                            <div
                                onClick={() => navigate("/products")}
                                className="relative rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
                            >
                                <img
                                    src={heroImg}
                                    alt="Fashion model wearing elegant clothing"
                                    className="w-full h-[420px] sm:h-[520px] md:h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>

                            {/* Floating card (hide on very small screens) */}
                            <div className="hidden sm:block absolute -bottom-6 -left-6 bg-card p-4 rounded-xl shadow-lg animate-float">
                                <div className="flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-full bg-accent/20 flex items-center justify-center">
                                        <span className="font-bold text-black">✦</span>
                                    </div>
                                    <div className="font-semibold text-sm">
                                        Premium Quality
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
                <div className="block lg:hidden justify-center m-4">
                    <Button onClick={()=>navigate("/products")} className="w-full ">Shop Now</Button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
