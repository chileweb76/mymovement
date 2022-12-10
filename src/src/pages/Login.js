import React, { useState } from "react";
import logo from '../img/mymovement_png.png';
import Form from 'react-bootstrap/Form'
import Button from "react-bootstrap/Button";
import Row from 'react-bootstrap/Row'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";



const Login = () => {
    const [password, setPassword] = useState({})
    const [email, setEmail] = useState({})
    const navigate = useNavigate();

    const emailChange = (e) => {
        setEmail(e.target.value)
    }
    const passwordChange = (e) => {
        setPassword(e.target.value)
    }
    

    const handleSubmit = (e) => { 
        e.preventDefault()
        async function fetchUser() {
            try {
                let user = {
                    email: email,
                    password: password
                };
                    const response = await axios.post('http://localhost:8080/api/v1/signin',  user, {
                        headers: {
                            crossorigin:true
                        }
                    })
                    const userData = response.data
                    
                    if (userData) {
                    localStorage.setItem('movementUser', JSON.stringify(userData) )
                    navigate('/homepage', {
                    })}
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
                    </Form.Group>
                    <Form.Group className="mb-5" controlId="formBasicPassword">
                        <Form.Label >Password</Form.Label>
                        <Form.Control onChange={passwordChange} size="lg" type="password" placeholder="Password" />
                        <div className="errorMessage"></div>
                    </Form.Group>
                    <Link className="forgotPassword" to='/forgotpassword'>Forgot Password</Link>
                    <Form.Group as={Row} className="mb-5 justify-content-center fixed-bottom" >
                        <Button type="submit" className="signin">Sign In</Button>
                        <div className="center">
                        <Link className="signuplink" to='/signup'>Sign Up</Link>
                        </div>
                    </Form.Group>
                </Form>
        </div>
    )

}

export default Login;