import React from 'react';

import '../styles/SigninPage.css';
import logo from '../logos/monopolylogo.png';
import useSignin from '../hooks/useSignin';
import { useState, useLayoutEffect} from 'react';
import { Link } from 'react-router-dom';

function useWindowSize() {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
      function updateSize() {
        setSize([window.innerWidth, window.innerHeight]);
      }
      window.addEventListener('resize', updateSize);
      updateSize();
      return () => window.removeEventListener('resize', updateSize);
    }, []);
    return size;
  }

const SignupPage = () => {
    const [handleChange, handleSubmit] = useSignin();
    const [width, height] = useWindowSize();

    return (
        
        <div className="row">
            <div  class="col s12 m6" style={{ position:"absolute",width:"50%",height:"60%",top:"20%",left:"25%"}}>

                    <div class="card-panel hoverable col s12 m12 l12" style={{ height:"100%"}}>
                        <div>
                            <img src={logo} style={{display:"block", margin:"auto",paddingLeft:"5px", paddingTop:"5%",height:window.innerHeight/5,width:"auto"}}/>
                        </div>
                        <form onSubmit={handleSubmit} style={{position:"absolute",bottom:"10%",right:"20%",left:"20%"}}>
                            <div className="input-field">
                                <input id="email" name="email" type="email" onChange={handleChange} required />
                                <label htmlFor="email">Email</label>
                            </div>
                            <div className="input-field ">
                                <input id="password" name="password" type="password" onChange={handleChange} required />
                                <label htmlFor="password">Password</label>
                            </div>
                            <p >
                                <label>
                                    <input type="checkbox" class="filled-in"  />
                                    <span>Remember me</span>
                                </label>
                            </p>
                            <div className="input-field">
                                <input type="submit" value="Sign In" className="btn submit-btn" />
                            </div>
                            <div>
                                Don't have an Account?
                                <Link to="/signup" style={{marginLeft:"5px"}}>Sign Up</Link>
                            </div>
                            
                        </form>
                    </div>
  
            </div>
            
        </div>
    );
};

export default SignupPage;