import React from "react";
import { Link } from 'react-router-dom';


const Nav = () => {

    return (
        <nav>
            <Link className="navlink" to='/homepage'>Home</Link>
            <Link className="navlink" to='/dailysummary'>Daily Summary</Link>
        </nav>
    )
}
export default Nav;