import React from "react";
import img from "../img/mymovement_favicon.png"

const Footer = () => {

    return (
        <footer>
            <p className="footer">© Christopher Hile 2022</p>
            <div id="edamam-badge" data-color="white"></div>
            <img src={img} alt="mm logo" className="footerLogo"/>
        </footer>
    )
} 

export default Footer;