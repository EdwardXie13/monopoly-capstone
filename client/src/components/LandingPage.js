import React from 'react';

import useLanding from '../hooks/useLanding';
import monoman from '../logos/monopolyman.png';
import logo from '../logos/logo.png';
import welcome from '../logos/welcome.png';

const LandingPage = () => {
    const [renderAuthButtons] = useLanding();
    
    return (
        <div className="row">
            <div>
                <img src={monoman} style={{position:"absolute",top:"10%",left:"5%",height:"800px"}}/>

                <div style={{position:"absolute",top:"10%",right:"10%",height:"50%",width:"45%"}}>
                    <img src={welcome} style={{position:"relative",display:"block",top:"10%",left:"20%",height:"auto", width:"60%"}}/>
                    <h1 style={{position:"relative",display:"inline-block",top:"-15%",left:"45%",color:"black",fontWeight:"900", fontSize:"5vw",textShadow: "0px 0px 4px white"}}>To</h1>
                    <img src={logo} style={{position:"relative",display:"block",left:"20%",height:"auto",width:"60%"}}/>
                
                    
                    <div style={{position:"relative",display:"block",left:"32%"}}>
                        <h1 style={{fontSize:"4vw"}}>Get Started</h1>
                        
                    </div>
                    <div style={{position:"relative",display:"block",left:"18%"}}>
                    { renderAuthButtons() }
                    </div>
                    
                </div>
                

                
            </div>
            
            
        </div>
    );
};

export default LandingPage;