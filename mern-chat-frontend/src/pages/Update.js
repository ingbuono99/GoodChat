import React, { useState } from "react";
import { Col, Container, Form, Row, Button } from "react-bootstrap";
import { useUpdateUserMutation, useLogoutUserMutation } from "../services/appApi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Signup.css";

function Update() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [updateUser, { isLoading, error }] = useUpdateUserMutation();
    const utente = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [logoutUser] = useLogoutUserMutation();
    //image upload states
    const [image, setImage] = useState(null);
    const [upladingImg, setUploadingImg] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    function validateImg(e) {
        const file = e.target.files[0];
        if (file.size >= 1048576) {
            return alert("Max file size is 1mb");
        } else {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }

    async function uploadImage() {
        const data = new FormData();
        data.append('file', image);
        data.append("upload_preset", "id_preset");  //quello è l'id del preset di Cloudinary, si richiama l'API con upload_preset
        try{
            setUploadingImg(true);
            let res = await fetch('https://api.cloudinary.com/v1_1/NAME/image/upload', {  //lì ci va l'id del nome su cloudinary
                method: 'post',
                body: data
            })
            const urlData = await res.json();
            setUploadingImg(false);
            return urlData.url;
        } catch (error) {
            setUploadingImg(false);
            console.log(error);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        if (!image) return alert("Please upload your profile picture");
        const url = await uploadImage(image);
        console.log(url);
        // signup the user
        updateUser({ name, email, password, picture: url }).then(({ data }) => {
            if (data) {
                console.log(data);
                alert("Dati modificati con successo, effettua di nuovo il login");
                handleLogout(e);
                
            }
        });
    }

    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(utente);
        // redirect to home page
        window.location.replace("/");
    }

    return (
        <Container>
            <Row>
                <Col md={7} className="d-flex align-items-center justify-content-center flex-direction-column">
                    <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleUpdate}>
                        <h1 className="text-center">Modifica i tuoi dati</h1>
                        <div className="signup-profile-pic__container">
                            <img src={imagePreview || utente.picture} className="signup-profile-pic" />
                            <label htmlFor="image-upload" className="image-upload-label">
                                <i className="fas fa-plus-circle add-picture-icon"></i>
                            </label>
                            <input type="file" id="image-upload" hidden accept="image/png, image/jpeg" onChange={validateImg} />
                        </div>
                        {error && <p className="alert alert-danger">{error.data}</p>}
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Nuovo nome</Form.Label>
                            <Form.Control type="text" placeholder="Nuovo nome" onChange={(e) => setName(e.target.value) } value={name} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" /*readonly="readonly"*/ placeholder="Email" onChange={(e) => setEmail(e.target.value) } value={email} /*value={utente?.email }*/ />
                            <Form.Text className="text-muted">Non puoi modificare il tuo indirizzo email, inseriscilo per motivi di sicurezza</Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Nuova password</Form.Label>
                            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {upladingImg || isLoading ? "Invio dati" : "Invio"}
                        </Button>
                        
                    </Form>
                </Col>
                <Col md={5} className="signup__bg"></Col>
            </Row>
        </Container>
    );
}

export default Update;
