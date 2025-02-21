import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faPaypal } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-section">
                <Link to="./about-liminal" className="footer-link">
                    What is a liminal image?
                </Link>
            </div>
            <div className="footer-section">
                <Link to="./about-liminal" className="footer-link">
                    About Liminal
                </Link>
            </div>
            <div className="footer-section">
                <a
                    href="https://www.paypal.com/donate?hosted_button_id=7SRZV6QNKP326"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link paypal-button"
                >
                    <FontAwesomeIcon icon={faPaypal} /> Donate
                </a>
            </div>
            <div className="footer-section">
                <Link to="/about-liminal#contact-form" className="footer-link">
                    <FontAwesomeIcon icon={faEnvelope} /> Contact
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
