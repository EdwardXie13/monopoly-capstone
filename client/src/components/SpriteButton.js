import Modal from 'react-modal';
import React, { useState, useContext } from 'react';

import sprites from '../library/sprites/sprites';
import RoomContext from '../contexts/RoomContext';

const customStyles = {
    content : {
      top                   : '50%',
      left                  : '50%',
      right                 : 'auto',
      bottom                : 'auto',
      marginRight           : '-50%',
      transform             : 'translate(-50%, -50%)',
      maxHeight             : '80vh',
      height                : '80vh',
      width                 : '75%'
    }
};

const SpriteButton = ({ setGamers, me, gamers, handleSpriteSelect }) => {
    const [modalIsOpen,setIsOpen] = useState(false);
    const [selection, setSelection] = useState('');
    // const { players, setPlayers } = useContext(RoomContext);
    // console.log(players);
    console.log(gamers);

    const openModal = () => setIsOpen(true);

    const closeModal = () => setIsOpen(false);

    const renderSprites = () => {
        return sprites.map((s, idx) => {
            return (
                <div className="sprite-container" onClick={ () => {
                        let i = 0
                        for(; i < sprites.length && selection.length > 0; ++i) {
                            if (sprites[i].srcDown === selection) {
                                sprites[i].picked = false;
                                break;
                            }
                        }

                        sprites[idx].picked = true;
                        setSelection(s.srcDown);
                        
                        let newGamers = null;
                        setGamers(prevGamers => {
                            for (let key in prevGamers) {
                                if (prevGamers[key].name === me.current) {
                                    prevGamers[key].spriteSrc = { srcUp: s.srcUp, srcDown: s.srcDown, srcleft: s.srcleft, srcRight: s.srcRight }
                                }
                            }

                            newGamers = prevGamers;
                            handleSpriteSelect({ newGamers: newGamers, oldIdx: i, newIdx: idx });
                            return prevGamers;
                        });

                    }} >
                    <input className="sprite-selection" type="radio" id={s.name} name="character" value={s.srcDown} />
                    <label htmlFor={s.name} style={ s.picked? { backgroundColor: 'yellow' } : null }>
                        <img className="sprite-img" src={s.srcDown} />
                        <div>{s.name}</div>
                    </label>
                </div>
            )
        });
    }

    return (
        <div>
            <button className="btn" onClick={openModal}>Pick Your Sprite</button>
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} contentLabel="Pick Your Sprite" style={customStyles}>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    { renderSprites() }
                </div>
            </Modal>
        </div>
    );
}

  export default SpriteButton;