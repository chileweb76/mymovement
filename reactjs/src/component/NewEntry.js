import React from "react";
import { Button } from "reactstrap";
import food from "../img/food.png";
import mood from "../img/mood.png";
import meds from "../img/meds.png";
import bowel from "../img/bowel.png";
import { Link } from "react-router-dom";

const NewEntry = () => {
    

    return (
        <div className="newEntryContainer">
            <h2>New Entry</h2>
                <div className="buttonContainer">
                <Link className="food" to={'/foodentry'}>
                <Button className="button" ><img className="icon" src={food} alt="food link"  /></Button>
                </Link>
                <Link className="mood" to={'/moodentry'} state={{ tag: "mood"}}>
                <Button className="button" ><img className="icon" src={mood} alt="mood link" /></Button>
                </Link>
                <Link className="meds" to={'/medsentry'} state={{ tag: "meds"}}>
                <Button className="button" ><img className="icon" src={meds} alt="meds link" /></Button>
                </Link>
                <Link className="bowel" to={'/bowelentry'} state={{ tag: "bowel" }}>
                <Button className="button"><img className="icon" src={bowel} alt="bowel link" /></Button>
                </Link>
                </div>
        </div>
    )
}

export default NewEntry;