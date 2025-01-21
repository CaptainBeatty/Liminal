import React from "react";
import { Link } from "react-router-dom";
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
        </footer>
    );
};

export default Footer;
