import React from "react";
import {Row, Col, Button} from "react-bootstrap";
import {useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import './Home.css'

function Home() {
    const user = useSelector((state) => state.user);
  return  (
    <Row>
  {(!user) ? <Row>
    <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
        <div>
            <h1> Benvenuto! </h1>
            <p> Non hai ancora un account GoodChat? </p>
            <LinkContainer to="/signup">
                <Button variant="success">Registrati ora! &nbsp;    
               <i className="fas fa-comments fa-user-check"></i>
                </Button>
            </LinkContainer>
        </div>
    </Col>
    <Col md={6} className="home__bg"></Col> </Row>
    :  
    <Row>
    <Col md={6} className="d-flex flex-direction-column align-items-center justify-content-center">
        <div>
            <h1> Bentornato! </h1>
            <p> Vuoi tornare alle chat? </p>
            <LinkContainer to="/chat">
                <Button variant="success"> Vai alla chat!
                <i className="fas fa-comments home-message-icon"></i>
                </Button>
            </LinkContainer>
        </div>
    </Col>
    <Col md={6} className="home__bg"></Col> </Row> }
</Row> 
  ); 
}

export default Home;