import React from 'react';

import '../styles/SignupPage.css';

import logo from '../logos/monopolylogo.png';
import useSignup from '../hooks/useSignup';
import { Link } from 'react-router-dom';

const SignupPage = () => {
    const [handleChange, handleSubmit] = useSignup();

    return (
        <div className="row">
            <div  class="col s12 m6" style={{ position:"absolute",width:"50%",height:"60%",top:"20%",left:"25%"}}>
                <div class="card-panel hoverable col s12 m12 l12" style={{ height:"100%"}}>
                    <div>
                    <img src={logo} style={{display:"block", margin:"auto",paddingLeft:"5px", paddingTop:"5%",height:window.innerHeight/5,width:"auto"}}/>
                    </div>
                    <form  style={{position:"absolute",bottom:"10%",right:"20%",left:"20%"}} onSubmit={handleSubmit}>
                        <div className="input-field">
                            <input id="email" name="email" type="email" onChange={handleChange} required />
                            <label htmlFor="email"> Email </label>
                        </div>
                        <div className="input-field">
                            <input id="password" name="password" type="password" onChange={handleChange} required />
                            <label htmlFor="password"> Password </label>
                        </div>
                        <div className="input-field">
                            <input id="Cpassword" name="Cpassword" type="password" onChange={handleChange} required />
                            <label htmlFor="Cpassword"> Confirm Password </label>
                        </div>
                        <div className="input-field">
                            <input type="submit" value="Sign Up" className="btn submit-btn" />
                        </div>
                        <div>
                            Already have an account?
                            <Link to="/signin" style={{marginLeft:"5px"}}>Sign In</Link>
                        </div>
                    </form>
                
                </div>                        
            </div>
        </div>
    );
};

export default SignupPage;