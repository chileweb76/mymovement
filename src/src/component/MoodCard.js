import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import moodImg from '../img/emoji-smile-fill.svg'
import { useNavigate } from "react-router-dom";

const MoodCard = ({user}) => {
    const navigate = useNavigate()
    //Mood
    const [mood, setMood] = useState([])
    const [date, setDate] = useState([])
    const [moodId, setMoodId] = useState([])

    useEffect(() => {
        async function fetchMood() {
            const response = await axios.get('http://localhost:8080/api/v1/mood/latest', {
                params: {
                    userId: user.user.id
                }
            })
            setMood(response.data[0])
            
            if (response.data.length > 0) {
                setMoodId(response.data[0].id)
            }

            if (response.data[0] !== undefined) {
                const date = new Date(response.data[0].updatedAt)
                setDate(date.toLocaleString())
            }
        }
        fetchMood()
    }, []);

    const update = () => {
        navigate('/moodentry', {
            state: {
                moodId
            }
        })
    }

    if (mood === undefined) {
        return(
            <Card className="moodCard">
                <div className="centeredIcon">
                    <img className="icon" src={moodImg} alt="food" />
                </div>
                <p>{date}</p>
            </Card>
        )
    } else {
        return (
            <Card className="moodCard">
                <div className="centeredIcon">
                    <img className="icon" src={moodImg} alt="food" />
                </div>
                <p>{date}</p>
                <Card.Img />
                <Card.Title>{mood.title} </Card.Title>
                <Card.Body> {mood.notes} </Card.Body>
                <Button className="update" onClick={update}>Update</Button>
            </Card>
        )
    }
}

export default MoodCard