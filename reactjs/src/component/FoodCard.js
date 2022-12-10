import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Button } from 'reactstrap'
import Card from 'react-bootstrap/Card'
import foodImg from '../img/basket-fill.svg'
import { useNavigate } from "react-router-dom";

const FoodCard = ({user}) => {
    const navigate = useNavigate()
    //Food
    const [food, setFood] = useState([])
    const [date, setDate] = useState([])
    const [foodId, setFoodId] = useState([])

    useEffect(() => {
        async function fetchFood() {
            const response = await axios.get('http://localhost:8080/api/v1/food/latest', {
                params: {
                    userId: user.user.id
                }
            })
            setFood(response.data[0])
         
            if (response.data.length > 0) {
                setFoodId(response.data[0].id)
            } 

            if (response.data[0] !== undefined) {
                const date = new Date(response.data[0].updatedAt)
                setDate(date.toLocaleString())
            }
        }
        fetchFood()
    }, []);

    const update = () => {
        navigate('/foodentry', {
            state: {
                foodId
            }
        })
    }

    if (food === undefined) {
        return (
            <Card className="foodCard">
                <div className="centeredIcon">
                    <img className="icon" src={foodImg} alt="food" />
                </div>
                <p>{date}</p>
            </Card>
        )
    } else {
        return (
            <Card className="foodCard">
                <div className="centeredIcon">
                    <img className="icon" src={foodImg} alt="food" />
                </div>
                <p>{date}</p>
                <Card.Img></Card.Img>
                <Card.Title>{food.title}</Card.Title>
                <Card.Body> {food.notes} </Card.Body>
                <Button className="update" onClick={update}>Update</Button>
            </Card>

        )
    }     
    
}

export default FoodCard;