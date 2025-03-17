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
            <section className="story">
                <h1 className="section-title">The story</h1>
                <p className="section-content">
                I was working a slave job and I was nearly forty years old, with no family, no career. Like many lost people, I earned a low-cost web development diploma. I thought I'd be able to quit my slave job and do something interesting, earning more money and being recognized by society as something other than a slave.
                After hundreds of job offers, dozens of fake phone interviews, and bogus job dating sites, I resigned myself.
                I would never have a well-paid, compliant remote job.
                Yet I didn't give up web development.
                I developed several websites for myself or friends.
                I'd like to say that Liminal is my creation. But I think it's more accurate to say that I am Liminal's creation.
                    </p>
            </section>
            <section className="about-section">
                <h1 className="section-title">Who are a liminal.uno user?</h1>
                <p className="section-content">
                    Some of us were born before the internet. At that time, memories were still preserved on postcards and photos. Cameras were bulky. Then technology and computers became accessible to the general public. The internet took a turn with the arrival of cheap subscriptions with higher speeds. In the early 2000s, it began to develop into the giant it is today. Today, if you are young enough, you can walk down the street of your old neighborhood a few years ago thanks to Google Maps. But for people who lived their childhoods in the 90s and 2000s, there is a loss of information. In this transition between the paper world and that of databases, it is as if memories have been sacrificed. <strong>We are that generation of people.</strong>
                </p>
            </section>
            <section className="liminal-section">
                <h1 className="section-title">What is a liminal image?</h1>
                <p className="section-content">
                    A liminal image represents a transitory space, often familiar, but devoid of any human presence. These places, whether empty hallways, deserted shopping malls, or illuminated parking lots at night, exude an eerie and timeless atmosphere. The complete absence of people is essential, as it reinforces this feeling of strangeness and suspension. This phenomenon has gained popularity on the internet thanks to the collective fascination with these empty spaces, which evoke solitude, nostalgia, and a mysterious connection to hazy memories. Beyond this definition, we believe that everyone has their own definition of liminal spaces. It is this diversity that interests us here. This space is not just a simple bank of strange images, it is above all a place of exchange around the feelings that we can experience in life.
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




                