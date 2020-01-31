import React from 'react';

import '../styles/SignupPage.css';
import useSignup from '../hooks/useSignup';

const SignupPage = () => {
    const [handleChange, handleSubmit] = useSignup();

    return (
        <div className="row">
            <form className="col s10 m4" onSubmit={handleSubmit}>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input id="email" name="email" type="email" onChange={handleChange} required />
                    <label htmlFor="email"> Email </label>
                </div>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input id="password" name="password" type="password" onChange={handleChange} required />
                    <label htmlFor="password"> Password </label>
                </div>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input id="Cpassword" name="Cpassword" type="Cpassword" onChange={handleChange} required />
                    <label htmlFor="Cpassword"> Confirm Password </label>
                </div>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input type="submit" value="Sign Up" className="btn submit-btn" />
                </div>
            </form>
        </div>
    );
};

export default SignupPage;