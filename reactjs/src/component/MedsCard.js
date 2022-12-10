import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import medsImg from '../img/capsule-pill.svg'
import { useNavigate } from "react-router-dom";

const MedsCard = ({user}) => {
    const navigate = useNavigate()
    //meds
    const [meds, setMeds] = useState([])
    const [date, setDate] = useState([])
    const [medsId, setMedsId] = useState([])
    
    useEffect(() => {
        async function fetchMeds() {
            const response = await axios.get('http://localhost:8080/api/v1/meds/latest', {
                params: {
                    userId: user.user.id
                }
            })
            setMeds(response.data[0])

            if (response.data.length > 0) {
                setMedsId(response.data[0].id)
            }

            if (response.data[0] !== undefined) {
                const date = new Date(response.data[0].updatedAt)
                setDate(date.toLocaleString())
            }
        }
        fetchMeds()
    }, []);

    const update = () => {
        navigate('/medsentry', {
            state: {
                medsId
            }
        })
    }

    if (meds === undefined) {
        return (
            <Card className="medsCard">
            <div className="centeredIcon">
                <img className="icon" src={medsImg} alt="food" />
            </div>
            </Card>
        )
    } else {
    return (
        <Card className="medsCard">
            <div className="centeredIcon">
                <img className="icon" src={medsImg} alt="food" />
            </div>
            <p>{date}</p>
            <Card.Img />
            <Card.Title> {meds.title} </Card.Title>
            <Card.Body> {meds.notes}</Card.Body>
            <Button className="update" onClick={update}>Update</Button>
        </Card>
    )
    }
}

export default MedsCard