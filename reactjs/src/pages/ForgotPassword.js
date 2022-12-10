import React, { useState } from "react";
import logo from '../img/mymovement_png.png';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import axios from "axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState({})

    const emailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => { 
        e.preventDefault()
        async function fetchUser() {
            try {
                let user = {
                    email: email,
                };
                    const response = await axios.post('http://localhost:8080/api/v1/forgotpassword',  user, {
                        headers: {
                            crossorigin:true
                        }
                    })
                    const userData = response.data.user
                    if (userData) {
                    localStorage.setItem('movementUser', JSON.stringify(userData) )
                   }
            } catch (error) {
                console.log(error)
                const div = document.querySelector('.errorMessage')

                const node = document.createTextNode("*Invalid email or password")
                div.appendChild(node)
            }
        }
        fetchUser();
    }

    return (
        <div className="loginContainer">
            <div className="center">
                <img className="loginLogo" src={logo} alt="logo"></img>
            </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-5" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control onChange={emailChange} size="lg" type="email" placeholder="Enter email" />
                        <Button type="submit" className="signin">Reset Password</Button>
                    </Form.Group>

                </Form>
        </div>
    )
}

export default ForgotPassword