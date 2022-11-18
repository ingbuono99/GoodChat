import React, { useContext, useState } from "react";
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { useLoginUserMutation } from "../services/appApi";
import "./Login.css";


function PasswordReset() {
    const [email, setEmail] = useState("");
    
    const [loginUser, { isLoading, error }] = useLoginUserMutation();



    return (
        <Container>
            <Row>
                <Col md={5} className="login__bg"></Col>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit="return false;">
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {error && <p className="alert alert-danger">{error.data}</p>}
                            <Form.Label>Inserisci la tua email, ti invieremo un link per resettare la password</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
                        </Form.Group>

                      
                        <Button variant="primary" type="submit">
                            {isLoading ? <Spinner animation="grow" /> : "Reset"}
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default PasswordReset;