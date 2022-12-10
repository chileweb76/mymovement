import React, { useState } from "react";
import logo from '../img/mymovement_png.png';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [name, setName] = useState({})
    const [email, setEmail] = useState({})
    const [password, setPassword] = useState({})
    const [rePassword, setRePassword] = useState({})
    const navigate = useNavigate()

    const nameChange = (e) => {
        setName(e.target.value)
    }
    const emailChange = (e) => {
        setEmail(e.target.value)
    }
    const passwordChange = (e) => {
        setPassword(e.target.value)
    }
    const rePasswordChange = (e) => {
        setRePassword(e.target.value)
    }

        
        const handleSubmit = (e) => {
            e.preventDefault()


            if (password === rePassword) {
            async function fetchUser() {
                let user = {
                    name: name,
                    email: email,
                    password: password
                };

                    try {
                        const response = await axios.post('http://localhost:8080/api/v1/signup',  user, {
                        headers: {
                            crossorigin:true
                        }
                    })
                    const userData = response.data.user
                    if (userData) {
                    localStorage.setItem('movementUser', JSON.stringify(userData) )
                    navigate('/homepage', {
                    })}
                    } catch (error) {
                        console.log(error)
                        const div = document.querySelector('.errorMessage')

                        const node = document.createTextNode("*Email already in use")
                        console.log(node)
                        div.appendChild(node)

                    }
                    
                    
                }
                fetchUser();
            } else {
                const passwordError = document.querySelector(".passwordError");
                passwordError.innerHTML = "Passwords must match"
            }
        }
    

    return (
        <div className="loginContainer">
            <div className="center">
                <img className="loginLogo" src={logo} alt="logo"></img>
            </div>
                <Form onSubmit={handleSubmit} >
                    <Form.Group className="mb-5" controlId="formName">
                        <Form.Label>Name*</Form.Label>
                        <Form.Control onChange={nameChange} size="lg" type="text" placeholder="Name" required/>
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="formBasicEmail">
                        <Form.Label>Email address*</Form.Label>
                            <Form.Control onChange={emailChange} size="lg" type="email" placeholder="Enter email" required />
                            <div className="errorMessage"></div>
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="formBasicPassword">
                            <Form.Label>Password*</Form.Label>
                            <Form.Control onChange={passwordChange} size="lg" type="password" placeholder="Password" required/>
                        </Form.Group>
                        <Form.Group className="mb-5" controlId="formReEnter">
                            <Form.Label>Re-Enter Password*</Form.Label>
                            <Form.Control onChange={rePasswordChange} size="lg" type="password" placeholder="Re-Enter Password" required/>
                            <div className="passwordError"></div>
                        </Form.Group>
                        <div>*Required Fields</div>
                        <Form.Group as={Row} className="mb-5 justify-content-center fixed-bottom" >
                            <div className="spacing">
                                <Button type="submit" className="signin">Sign In</Button>
                            </div>
                        </Form.Group>
                    </Form>
            </div>
        )

}


export default SignUp;