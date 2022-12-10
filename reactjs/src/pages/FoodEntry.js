import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Card, CardGroup } from "reactstrap";
import img from "../img/search.svg"
import Footer from "../component/Footer";
import Header from "../component/Header";
import NewEntry from "../component/NewEntry";
import { useLocation, useNavigate } from "react-router-dom";




const FoodEntry = () => {
    const user = localStorage.getItem('movementUser')
    const navigate = useNavigate()
    const foodId = useLocation()
    
    if (!user) {
        navigate('/login')
    }
    const userParsed = JSON.parse(user)
    
    const [search, setSearch] = useState({})
    const [foodLabel, setFoodLabel] = useState("Search Results")
    const [title, setTitle] = useState("")
    const [ingredients, setIngredients] = useState("")
    const [show, setShow] = useState(false)

    const searchChange = (e) => {
        setSearch(e.target.value)
    }

    const titleChange = (e) => {
        setTitle(e.target.value)
    }

    const ingredientChange = (e) => {
        setIngredients(e.target.value)
    }

    //food entry by id
    useEffect(() => {
        
        if (foodId.state !== null) {
            const idFood = foodId.state.foodId
            async function fetchPost() {
                try {
                    const response = await axios(`http://localhost:8080/api/v1/food/${idFood}`)
                    setTitle(response.data.title)
                    setIngredients(response.data.notes)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchPost();
            //Delete Button
            setShow(true)
        }
        

    }, []);

    const handleSearch = (e) => {
        e.preventDefault();

        async function fetchAPI(){
            try {
                const response = await axios(`https://api.edamam.com/api/food-database/v2/parser?app_id=cd2130a5&app_key=ca65ba68ddafb742a94c488a4bfd3285&upc=${search}&nutrition-type=cooking`)
                setFoodLabel(response.data.hints[0].food.label)
                const notes = [response.data.hints[0].food.label, ":     ", response.data.hints[0].food.foodContentsLabel]
                setIngredients(notes.join('')) 
                    
            }
            catch(err) {
                console.log(err);
                setFoodLabel("Not Found (double check the upc code) or not in database")
            }
        }
        fetchAPI()
       
    }
   
    const handleSubmit = (e) => {
        e.preventDefault();
        let food = {
            userId: userParsed.id,
            title: title,
            notes: ingredients,
            tag: "food"
        }
        //update food entry else create post
        if (foodId.state !== null) {
            const idFood = foodId.state.foodId
            async function fetchPost() {
                try {
                    await axios.post(`http://localhost:8080/api/v1/food/${idFood}/update`, food, {
                    } )
                    
                } catch (error) {
                    console.log(error)
                }
            }
            fetchPost();
            navigate('/homepage')
        } else {
            async function fetchPost() {
                try {
                    await axios.post('http://localhost:8080/api/v1/food', food, {
                    } )
                    
                } catch (error) {
                    console.log(error)
                }
            }
            fetchPost();
            navigate('/homepage')
        }
    }

    const handleDelete = (e) => {
        e.preventDefault();
        const idFood = foodId.state.foodId
        async function fetchPost() {
            try {
                await axios(`http://localhost:8080/api/v1/food/${idFood}/delete` )
                
            } catch (error) {
                console.log(error)
            }
        }
        fetchPost();
        navigate('/homepage')
    }

    
    
    return (
        <>
        <Header />
        <NewEntry />
        <CardGroup className="cardGroup" >
            <Card className="foodContainer">
                <h2 className="entryH2">Food Entry</h2>
                <CardGroup>
                    <Card className="search">
                    <p className="p">Search for foods by UPC</p>
                    <form  onSubmit={handleSearch} className="searchBar">
                    <InputGroup>
                        <Form.Control onChange={searchChange}
                        className="input"
                        placeholder="UPC Search"
                        aria-label="UPC Search"
                        aria-describedby="basic-addon2"
                        />
                        <Button type="submit" className="searchButton">
                        <img  src={img} alt="search link"  />
                        </Button>
                    </InputGroup>
                    </form>
                    <p className="p">Search Results</p>
                        <Card className="results">{foodLabel} </Card>  
                    </Card>
                    <Card className="ingredients">
                        <p className="p">Title</p>
                        <InputGroup>
                            <Form.Control onChange={titleChange}
                            className="title"
                            aria-label="Title"
                            aria-describedby="basic-addon2"
                            value={title}
                            />
                        </InputGroup>
                        <p className="p">Notes</p>
                        <textarea onChange={ingredientChange} className="textarea" value={ingredients} placeholder="Ingredients List"></textarea> 
                        <Card className="buttons">
                        <form onSubmit={handleSubmit} className="save">
                            <Button type="submit" className="entryButton">Save</Button>
                        </form>
                        <form onSubmit={handleDelete} className="delete">
                            {show && <Button type="submit" className="entryButton">Delete</Button>}
                        </form>
                        </Card> 
                    </Card>
                </CardGroup>
            </Card>
        </CardGroup>
    
        <Footer />
        </>
    )
}

export default FoodEntry;