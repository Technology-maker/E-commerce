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

            const API = import.meta.env.VITE_API_BASE_URL

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
        <section id="contact" className=" pb-5">
            {/* Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                    CONTACT
                </h2>
                
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl p-2">
                <form
                    ref={form}
                    onSubmit={sendEmail}
                    className="max-w-xl mx-auto rounded-xl shadow-lg p-6 flex flex-col gap-6 bg-gradient-to-br from-slate-400 via-gray-300 to-white"
                >
                    <h3 className="text-xl text-black text-center">
                        Connect Us
                    </h3>

                    <Input label="Your Name" name="name" placeholder="Enter your full name" />
                    <Input label="Your Email" name="email" type="email" placeholder="Enter your email" />
                    <Input label="Subject" name="subject" placeholder="Subject" />
                    <Input label="Number" name="number" type="number" placeholder="Phone No" />

                    <div className="flex flex-col gap-2">
                        <label className="font-semibold text-black">Message</label>
                        <textarea
                            name="message"
                            rows={5}
                            required
                            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none placeholder-slate-700"
                            placeholder="Type your message..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#e65f5c] text-white font-bold py-2 rounded-md hover:bg-[#c94c4a] transition-colors duration-200 disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send"}
                    </button>
                </form>
            </div>
        </section>
    );
};

const Input = ({ label, name, type = "text", placeholder }) => (
    <div className="flex flex-col gap-2">
        <label className="font-semibold text-black">{label}</label>
        <input
            type={type}
            name={name}
            required
            className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-slate-600"
            placeholder={placeholder}
        />
    </div>
);

export default Contact;
