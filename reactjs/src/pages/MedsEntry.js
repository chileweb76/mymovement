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

const MedsEntry = () => {
    const user = localStorage.getItem('movementUser')
    const navigate = useNavigate()
    const medsId = useLocation()

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
        
        if (medsId.state.medsId !== undefined) {
            const idMeds = medsId.state.medsId
            async function fetchPost() {
                try {
                    const response = await axios(`http://localhost:8080/api/v1/meds/${idMeds}`)
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
        let meds = {
            userId: userParsed.id,
            title: title,
            notes: notes,
            tag: "meds"
        }
        //update meds entry else create post
        if (medsId.state.medsId !== undefined) {
            const idMeds = medsId.state.medsId
            async function fetchPost() {
                try {
                    await axios.post(`http://localhost:8080/api/v1/meds/${idMeds}/update`, meds, {
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
                    await axios.post('http://localhost:8080/api/v1/meds', meds, {
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
        const idMeds = medsId.state.medsId
        async function fetchPost() {
            try {
                await axios(`http://localhost:8080/api/v1/meds/${idMeds}/delete` )
                
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
            <Card className="medsContainer">
                <h2 className="entryH2">Meds Entry</h2>
                <CardGroup>
                    <Card className="medsNotes">
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
                        <Card className="medsButtons">
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

export default MedsEntry;