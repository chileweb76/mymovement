import axios from "axios";
import React, { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Card, CardGroup } from "reactstrap";
import Footer from "../component/Footer";
import Header from "../component/Header";
import NewEntry from "../component/NewEntry";
import { useLocation, useNavigate } from "react-router-dom";

const BowelEntry = () => {
    const user = localStorage.getItem('movementUser')
    const navigate = useNavigate()
    const bowelId = useLocation()
    
    if (!user) {
        navigate('/login')
    }
    const userParsed = JSON.parse(user)
    
    
    const [title, setTitle] = useState("")
    const [notes, setNotes] = useState("")
    const [show, setShow] = useState(false)

    const titleChange = (e) => {
        setTitle(e.target.value)
    }

    const notesChange = (e) => {
        setNotes(e.target.value)
    }

    //mood entry by id
    useEffect(() => {
        
        if (bowelId.state.bowelId !== undefined) {
            const idbowel = bowelId.state.bowelId
            async function fetchPost() {
                try {
                    const response = await axios(`http://localhost:8080/api/v1/bowel/${idbowel}`)
                    setTitle(response.data.title)
                    setNotes(response.data.notes)
                } catch (error) {
                    console.log(error)
                }
            }
            fetchPost();
            //Delete Button
            setShow(true)
        }
        

    }, []);

   
    const handleSubmit = (e) => {
        e.preventDefault();
        let bowel = {
            userId: userParsed.id,
            title: title,
            notes: notes,
            tag: "bowel"
        }
        //update bowel entry else create post
        if (bowelId.state.bowelId !== undefined) {
            const idBowel = bowelId.state.bowelId
            async function fetchPost() {
                try {
                    await axios.post(`http://localhost:8080/api/v1/bowel/${idBowel}/update`, bowel, {
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
                    await axios.post('http://localhost:8080/api/v1/bowel', bowel, {
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
        const idBowel = bowelId.state.bowelId
        async function fetchPost() {
            try {
                await axios(`http://localhost:8080/api/v1/bowel/${idBowel}/delete` )
                
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
            <Card className="bowelContainer">
                <h2 className="entryH2">Bowel Entry</h2>
                <CardGroup>
                    <Card className="bowelNotes">
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
                        <textarea onChange={notesChange} className="textarea" value={notes} placeholder="Notes"></textarea> 
                        <Card className="bowelButtons">
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

export default BowelEntry;