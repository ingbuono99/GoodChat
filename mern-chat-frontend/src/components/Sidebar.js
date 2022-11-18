import React, { useContext, useEffect, useState} from "react";
import { Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { useAddFriendMutation } from "../services/appApi";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./Sidebar.css";

function Sidebar() {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const [inputname, setInputName] = useState("");
    const [inputname2, setInputName2] = useState("");
    const { socket, setMembers, members, setCurrentRoom, setRooms, privateMemberMsg, rooms, setPrivateMemberMsg, currentRoom } = useContext(AppContext);
    const [newFriend] = useAddFriendMutation();
   const [nome_amici, setNomeAmici] = useState(""); //salvo la lista degli amici dell'utente (solo il nome, perchè salvo solo quello nel db)


    function joinRoom(room, isPublic = true) {
        if (!user) {
            return alert("Please login");
        }
        socket.emit("join-room", room, currentRoom);
        setCurrentRoom(room);

        if (isPublic) {
            setPrivateMemberMsg(null);
        }
       
        dispatch(resetNotifications(room));
    }

    socket.off("notifications").on("notifications", (room) => {
        if (currentRoom != room) dispatch(addNotifications(room));
    });

    useEffect(() => {
        if (user) {
            setCurrentRoom("general");
            getRooms();
            socket.emit("join-room", "general");
            socket.emit("new-user");
            setNomeAmici(user.friends);
        }
    }, []);

    socket.off("new-user").on("new-user", (payload) => {
        setMembers(payload);
    });

    function getRooms() {
        fetch("http://localhost:5001/rooms")
            .then((res) => res.json())
            .then((data) => setRooms(data));
    }
    

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }

    async function addFriend (member){
    newFriend({user , member }).then(({ data }) => {
        if (data) {
            console.log(data);
            setNomeAmici(user.friends + member.name);
            alert("Hai aggiunto con successo " + member.name + " alla tua lista degli amici!");
        }
        else alert("Errore, nessuna modifica");
    
    });
    } 



    function handlePrivateMemberMsg(member) {
        setPrivateMemberMsg(member);
        const roomId = orderIds(user._id, member._id);
        joinRoom(roomId, false);
    }

    if (!user) {
        return <></>;
    }
    return (
        
        <>
            <h2>Stanze pubbliche</h2>
            <ListGroup>
                {rooms.map((room, idx) => (
                    <ListGroup.Item key={idx} onClick={() => joinRoom(room)} active={room == currentRoom} style={{ cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                        {room} {currentRoom !== room && <span className="badge rounded-pill bg-primary">{user.newMessages[room]}</span>}
                    </ListGroup.Item>
                ))}


            </ListGroup>
            <h2>Amici stretti <input type="text" id="myInput2" className="searchBar" onChange={(e) => {setInputName2(e.target.value); }} value={inputname2} placeholder="Cerca utente"></input> </h2>
            {members.filter(amico => amico.name.toLowerCase().includes(inputname2.toLowerCase()) && nome_amici.includes(amico.name)).map((friend) => (  //aggiorno dinamicamente la lista membri al variare dell'input inserito dall'utente
               <ListGroup.Item  key={friend.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id == friend?._id} onClick={() => handlePrivateMemberMsg(friend)} disabled={friend._id === user._id} > 
                    <Row>
                        <Col xs={2} className="member-status">
                            <img src={friend.picture} className="member-status-img" />
                            {friend.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                        </Col>
                        <Col xs={9}>
                            {friend.name}
                            {friend._id === user?._id && " (You)"}
                            {friend.status == "offline" && " (Offline)"}
                        </Col>
                        <Col xs={1}>
                            <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(friend._id, user._id)]}</span>
                        </Col>
                    </Row>
                </ListGroup.Item> 
            ))}


            <h2>Membri <input type="text" id="myInput" className="searchBar" onChange={(e) => {setInputName(e.target.value); }} value={inputname} placeholder="Cerca utente"></input> </h2>
            {members.filter(membro => membro.name.toLowerCase().includes(inputname.toLowerCase())).map((member) => (  //aggiorno dinamicamente la lista membri al variare dell'input inserito dall'utente
                <ListGroup.Item  key={member.id} style={{ cursor: "pointer" }} active={privateMemberMsg?._id == member?._id} onClick={() => handlePrivateMemberMsg(member)} disabled={member._id === user._id} >
                    <Row>
                        <Col xs={2} className="member-status">
                            <img src={member.picture} className="member-status-img" />
                            {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
                        </Col>
                        <Col xs={9}>
                            {member.name}
                            {member._id === user?._id && " (You)"}
                            {member.status == "offline" && " (Offline)"}
                        </Col>
                        <Col xs={1}>
                            <span className="badge rounded-pill bg-primary">{user.newMessages[orderIds(member._id, user._id)]}</span>
                            {(nome_amici.includes(member.name)==[] && member.name != user.name) ? <span className="add-tbn" class="fa fa-user one" aria-hidden="true" onClick={() => addFriend(member) }  > </span> :  <></> }  
                        </Col>
                    </Row>
                </ListGroup.Item>
            ))}

        </>
    );
}

export default Sidebar;