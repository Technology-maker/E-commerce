import { Link } from "react-router-dom";
import { Instagram, Linkedin } from "lucide-react";
import { useSelector } from "react-redux";

const Footer = () => {

    const { user } = useSelector(store => store.user);

    const footerLinks = {

        help: [
            { name: "Home", href: "/" },
            { name: "Products", href: "/products" },
            { name: "Cart", href: "/cart" },
            { name: "My Account", href: user ? `/profile/${user?._id}` : "/login" },
            
        ],
        company: [
            { name: "Contact Us", href: "/contact" },
            { name: "Careers", href: "#" },
            { name: "Sustainability", href: "#" },
            { name: "Press", href: "#" },
        ],
    };

    const socialLinks = [
        { icon: Instagram, href: "https://www.instagram.com/yadav_sarkar1519?igsh=Z3hsMzY1NnFkaHhq" },
        { icon: Linkedin, href: "https://www.linkedin.com/in/satender-yadav-a39b622a0/" },

    ];

    return (
        <footer className="bg-primary text-primary-foreground">
            <div className="container mx-auto px-4 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 ">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="font-heading text-3xl font-semibold tracking-tight">
                            E-commerce
                        </Link>
                        <p className="mt-4 text-primary-foreground/70 max-w-sm leading-relaxed">
                            Discover curated collections of premium fashion, designed for those who appreciate timeless elegance and modern sophistication.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    target="blank"
                                    className="h-10 w-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
                                >
                                    <social.icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 md:contents">

                        {/* Company Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Company</h4>
                            <ul className="space-y-3">
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>



                        {/* Help Links */}
                        <div>
                            <h4 className="font-semibold text-lg mb-4">Help</h4>
                            <ul className="space-y-3">
                                {footerLinks.help.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-primary-foreground/70 hover:text-accent transition-colors duration-300"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>


                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-primary-foreground/50">
                        © 2026 E-commerce. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-sm text-primary-foreground/50">
                        <a href="#" className="hover:text-primary-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-primary-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
