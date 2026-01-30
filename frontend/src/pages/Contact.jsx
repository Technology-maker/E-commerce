import React, { useRef, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const Contact = () => {
    const form = useRef(null);
    const [loading, setLoading] = useState(false);

    const sendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = {
            name: form.current.name.value,
            email: form.current.email.value,
            subject: form.current.subject.value,
            number: form.current.number.value,
            message: form.current.message.value,
        };

        try {
            const API = import.meta.env.VITE_API_BASE_URL;

            const res = await axios.post(
                `${API}/user/support`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (res.data.success) {
                toast.success(res.data.message || "Message sent successfully!");
                form.current.reset();
            } else {
                toast.error(res.data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section
            id="contact"
            className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden bg-slate-950"
        >
            {/* Background Decorative Blobs (Ambient Light) */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />

            <div className="relative z-10 w-full max-w-4xl">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <span className="text-sm font-semibold tracking-widest text-blue-400 uppercase">
                        Get in Touch
                    </span>
                    <h2 className="mt-2 text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Let's start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">conversation</span>
                    </h2>
                    <p className="mt-4 text-slate-400 max-w-xl mx-auto text-lg">
                        Questions about products, orders, or delivery? 🛒 Reach out — we’ve got you covered.
                    </p>
                </div>

                {/* Glassmorphism Form Container */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-5">

                        {/* Left Side: Contact Info (Optional Visual) or pure layout */}
                        <div className="p-8 md:p-10 md:col-span-2 bg-gradient-to-br from-blue-900/50 to-slate-900 border-b md:border-b-0 md:border-r border-white/5 flex flex-col justify-between">
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-4">Contact Info</h3>
                                <p className="text-slate-400 mb-8">
                                    Fill out the form and our team will get back to you within 24 hours.
                                </p>

                                <div className="space-y-4 text-slate-300">
                                    {/* Mock Details - Replace with real data if you want */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                        <span>satenderyadav301019@gmail.com</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                        <span>+91 9352397644</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 md:mt-0">
                                <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                    <p className="text-sm text-slate-400 italic">"Great design isn’t just about looks. It’s about making shopping effortless."</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: The Form */}
                        <div className="p-8 md:p-10 md:col-span-3">
                            <form ref={form} onSubmit={sendEmail} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input label="Your Name" name="name" placeholder="John Doe" />
                                    <Input label="Phone Number" name="number" type="number" placeholder="+91 9999999999" />
                                </div>

                                <Input label="Email Address" name="email" type="email" placeholder="john@example.com" />
                                <Input label="Subject" name="subject" placeholder="Project Inquiry" />

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-300">Message</label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                                        placeholder="Tell us about your project..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        "Send Message"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Reusable Input Component
const Input = ({ label, name, type = "text", placeholder }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">{label}</label>
        <input
            type={type}
            name={name}
            required
            className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            placeholder={placeholder}
        />
    </div>
);

export default Contact;