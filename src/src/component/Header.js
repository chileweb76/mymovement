import axios from 'axios';
import React from  'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Button } from 'reactstrap';
import logo from '../img/mymovement_png.png';
import avatar from '../img/person-circle.svg';
import Nav from './Nav'

const Header = ({user}) => {
    const newDate = new Date();
    const navigate = useNavigate()
    const logout = () => {
        localStorage.removeItem('movementUser')
        
            async function destroyToken() {
                try {
            
                await axios.post('http://localhost:8080/api/v1/logout',  {
                   data: user.loginToken.token
                })
            
                }catch (error) {
                    console.log(error)
                }
            }
        destroyToken()
        navigate('/')
    }


    return (
        <header>
            <Row className='row align-items-center'>
                <Col className='d-flex justify-content-evenly align-items-center'>
                <img className='logo' src={logo} alt="logo"></img>
                <Nav />
                <div className='settings'>
                    <Button className='logoutLink' onClick={logout}>Logout</Button>
                    <img className='icon' src={avatar} alt="avatar" />
                    <p>{newDate.toDateString()}</p>
                </div>
                </Col>
            </Row>
        </header>   
    )
}

export default Header;

