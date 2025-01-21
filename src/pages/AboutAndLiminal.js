import React from 'react';
import './AboutAndLiminal.css'; // Import des styles

const AboutAndLiminal = () => {
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
        </div>
    );
};

export default AboutAndLiminal;
