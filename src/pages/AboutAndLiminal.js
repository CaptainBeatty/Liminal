import React, { useState } from 'react';
import './AboutAndLiminal.css'; // Import des styles
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import api from "../services/axiosInstance"; // Import de l'instance axios

const AboutAndLiminal = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [messageSent, setMessageSent] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/contact", formData);
            if (response.status === 200) {
                setMessageSent(true);
                setFormData({ name: "", email: "", message: "" });
            } else {
                console.error("Erreur lors de l'envoi du message.");
            }
        } catch (err) {
            console.error("Erreur lors de la soumission du formulaire:", err);
        }
    };

    return (
        <div className="about-liminal-container">
            <section className="about-section">
                <h1 className="section-title">Who are we ?</h1>
                <p className="section-content">
                    We are a community passionate about liminality and the emotions it evokes. Our goal is to bring together people who are sensitive to these unique feelings, whether nostalgia, curiosity, or contemplation. Through this platform, we explore together the emotional impact of liminal images and their ability to trigger memories or inspire new perspectives. Join us to share your experiences and celebrate the beauty of liminal spaces.
                </p>
            </section>
            <section className="liminal-section">
                <h1 className="section-title">What is a liminal image?</h1>
                <p className="section-content">
                    A liminal image represents a transitory space, often familiar, but devoid of any human
                    presence. These places, whether empty corridors, deserted shopping malls
                    or parking lots lit up at night, exude an eerie and timeless atmosphere. The complete absence
                    of people is essential, as it reinforces this feeling of strangeness and suspension. This phenomenon
                    has gained popularity on the Internet due to the collective fascination with these empty spaces,
                    which evoke at the same time solitude, nostalgia and a mysterious connection to hazy memories.
                </p>
            </section>

            <section id="contact-form" className="contact-section">
                <h2><FontAwesomeIcon icon={faEnvelope} /> Contact</h2>
                {messageSent ? (
                    <p>Thank you! Your message has been sent.</p>
                ) : (
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        <button type="submit" className="submit-button">Send</button>
                    </form>
                )}
            </section>
        </div>
    );
};

export default AboutAndLiminal;