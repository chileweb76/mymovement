import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import bowelImg from '../img/toiletpaper.svg'
import { useNavigate } from "react-router-dom";


const BowelCard = ({user}) => {
    const navigate = useNavigate()
    //bowel
    const [bowel, setBowel] = useState([])
    const [date, setDate] = useState([])
    const [bowelId, setBowelId] = useState([])

    useEffect(() => {
        async function fetchBowel() {
            const response = await axios.get('http://localhost:8080/api/v1/bowel/latest', {
                params: {
                    userId: user.user.id
                }
            })
            setBowel(response.data[0])

            if (response.data.length > 0) {
                setBowelId(response.data[0].id)
            }

            if (response.data[0] !== undefined) {
                const date = new Date(response.data[0].updatedAt)
                setDate(date.toLocaleString())
            }
        }
        fetchBowel()
    }, []);

    const update = () => {
        navigate('/bowelentry', {
            state: {
                bowelId
            }
        })
    }

    if (bowel === undefined) {
        return (
            <Card className="bowelCard">
                <div className="centeredIcon">
                    <img className="icon" src={bowelImg} alt="food" />
                </div>
            </Card>
        )
    } else {
        return (
            <Card className="bowelCard">
                <div className="centeredIcon">
                    <img className="icon" src={bowelImg} alt="food" />
                </div>
                <p>{date}</p>
                <Card.Img />
                <Card.Title> {bowel.title} </Card.Title>
                <Card.Body> {bowel.notes} </Card.Body>
                <Button className="update" onClick={update}>Update</Button>
            </Card>
        )
    }
}

export default BowelCard