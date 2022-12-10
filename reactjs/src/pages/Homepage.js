import React from "react";
import NewEntry from "../component/NewEntry";
import Header from "../component/Header"
import Footer from "../component/Footer"
import CardGroup from 'react-bootstrap/CardGroup'
import FoodCard from "../component/FoodCard";
import MoodCard from "../component/MoodCard";
import MedsCard from "../component/MedsCard";
import BowelCard from "../component/BowelCard";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
    const user = localStorage.getItem('movementUser')
    const navigate = useNavigate()

    if (!user) {
        navigate('/login')
    }
    const userParsed = JSON.parse(user)

     return (
        <>
            <Header user={userParsed}/>
            <NewEntry user={userParsed}/>
                <h2 className="latesth2">Latest Entry</h2>
            <CardGroup>
                <FoodCard user={userParsed}/>
                <MoodCard user={userParsed}/>
                <MedsCard user={userParsed}/>
                <BowelCard user={userParsed}/>
            </CardGroup>
            <Footer />
        </>
    )
}

export default Homepage;