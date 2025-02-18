import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faCcPaypal } from "@fortawesome/free-brands-svg-icons"; // Icône PayPal
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
                    Who are we ?
                </Link>
            </div>
            <div className="footer-section">
                <a
                    href="https://www.paypal.com/donate?hosted_button_id=C3JR8J3FW89XC"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link paypal-button"
                >
                    <FontAwesomeIcon icon={faCcPaypal} /> Donate with PayPal
                </a>
            </div>
            <div className="footer-section">
                <a href="mailto:webmaster@liminal.com" className="footer-link">
                    <FontAwesomeIcon icon={faEnvelope} /> Contact Webmaster
                </a>
            </div>
        </footer>
    );
};

export default Footer;
