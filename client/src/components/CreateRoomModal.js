import React, { useState } from 'react';
import Modal from 'react-modal';
import shortid  from 'shortid';

Modal.setAppElement('#create-room-modal');

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

const CreateRoomModal = ({ handleCreateRoom }) => {
  const [modalIsOpen,setIsOpen] = useState(false);
  const [form, setForm] = useState({
    roomName: "",
    private: false,
    password: "",
    roomId: shortid.generate().substring(0,5)
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const handlePrivacyChange = e => {
    const className = e.target.name == "private"? "public" : "private";
    document.querySelector(`.${className}-radio`).checked = false;
    setForm({ ...form, private: e.target.name === "private", password: "" });
  }

  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const handleSubmitForm = () => {
    handleCreateRoom(form);
  }

  return (
    <div>
      <a className="btn-floating btn-large waves-effect waves-light" onClick={openModal}><i class="material-icons">add</i></a>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Create a New Room" style={customStyles}>
        <div style ={{ backgroundColor:"white", height:"42%", width:"500px",borderRadius: "1rem", padding: "0 1.5rem"}}>
          <form action="#" onSubmit={ e => e.preventDefault() }>
            <div className="center" style={{ fontSize:"27pt" }}>Create Room</div>
            <div className="input-field col s6" style={{ margin: "1.6rem 0" }}>
              <span style={{fontSize:"1.5rem", paddingTop:"20px"}}>Room Name:</span>
              <input id="room-name" name="roomName" type="text" onChange={handleFormChange} style={{ fontSize: "1.3rem", padding: "0 1.5rem", margin: "0 1.5rem", border: "1px solid #9e9e9e", borderRadius: "1.5rem", width: "50%" }} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{ marginRight: "1rem" }}>
                <label>
                  <input name="public" className="public-radio" type="radio" checked={ form.private === false } onChange={handlePrivacyChange} />
                  <span style={{fontSize:"18pt", color:"black"}}>Public</span>
                </label>
              </span>
              <span style={{ marginLeft: "1rem" }}>
                <label>
                  <input name="private" className="private-radio" type="radio" checked={ form.private === true } onChange={handlePrivacyChange} />
                  <span style={{ fontSize:"18pt", color:"black", margin: "1rem 0"}}>Private</span>
                </label>
              </span>
            </div>
            {
              form.private? (
                <>
                  <span style={{ fontSize:"1.5rem", paddingTop:"20px" }}>Private Key:</span>
                  <input id="password" name="password" type="password" onChange={handleFormChange} style={{ fontSize: "1.3rem", padding: "0 1.5rem", margin: "0 1.9rem", border: "1px solid #9e9e9e", borderRadius: "1.5rem", width: "50%" }} />
                </>
              ) : null
            }
            <div style={{display:"inline-block"}}>
              <div style={{fontSize:"20pt", paddingTop:"20px"}}>Rules:</div>
              <p>
                <label>
                  <input name="Rules" type="radio" defaultChecked />
                  <span style={{fontSize:"18pt", color:"black"}}>Standard</span>
                </label>
              </p>
              <p>
                <label>
                  <input name="Rules" type="radio" />
                  <span style={{fontSize:"18pt", color:"black"}}>Custom</span>
                </label>
              </p>
            </div>
            <div style={{display:"inline-block", paddingTop:"20px", paddingLeft:"40px"}}>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" />
                  <span style={{fontSize:"18pt", color:"black"}}>Free Parking Cash</span>
                </label>
              </p>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" />
                  <span style={{fontSize:"18pt", color:"black"}}>No Auction</span>
                </label>
              </p>
              <p>
                <label>
                  <input type="checkbox" class="filled-in" />
                  <span style={{fontSize:"18pt", color:"black"}}>Uneven Building</span>
                </label>
              </p>
            </div>
            {/* <button className="btn-large" onClick={handleCreateRoom} style={{ fontSize:"15pt", borderRadius: "1rem" }}>Create Room</button> */}
          </form>

          <div style={{ margin: "1.5rem 0", display: "flex", justifyContent: "center" }}>
            <button className="btn" style={{ width: "50%", fontSize: "1.1rem", margin: "0 1rem" }} onClick={handleSubmitForm}>Create</button>
            <button className="btn" style={{ width: "50%", fontSize: "1.1rem", margin: "0 1rem" }} onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CreateRoomModal;
