import Modal from 'react-modal';
import React, { useState, useEffect } from 'react';

import sprites from '../library/sprites/sprites';

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


const SpriteButton = ({ setGamers, me, gamers, handleSpriteSelect, openSprite, setOpenSprite, disabled, handleOpenSpriteWindow, style, children }) => {
    const [selection, setSelection] = useState('');
    useEffect(() => {}, [openSprite]);

    const openModal = () => setOpenSprite(true);

    const closeModal = () => setOpenSprite(false);

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
                    <input className="sprite-selection" type="radio" id={s.srcDown} name="character" value={s.srcDown} />
                    <label htmlFor={s.srcDown} style={ s.picked? { backgroundColor: 'yellow' } : null }>
                        <img className="sprite-img" src={s.srcDown} />
                        <div>{s.name}</div>
                    </label>
                </div>
            )
        });
    }

    return (
        <div>
            <button style={style} className="btn" disabled={disabled} onClick={handleOpenSpriteWindow}>Pick Sprites</button>
            <Modal isOpen={openSprite} onRequestClose={closeModal} contentLabel="Pick Your Sprite" style={customStyles}>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    { renderSprites() }
                    { children }
                </div>
            </Modal>
        </div>
    );
}

  export default SpriteButton;