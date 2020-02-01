import React from 'react';

import '../styles/SigninPage.css';
import useSignin from '../hooks/useSignin';

const SignupPage = () => {
    const [handleChange, handleSubmit] = useSignin();

    return (
        <div className="row">
            <form className="col s10 m4" onSubmit={handleSubmit}>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input id="email" name="email" type="email" onChange={handleChange} required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input id="password" name="password" type="password" onChange={handleChange} required />
                    <label htmlFor="password">Password</label>
                </div>
                <div className="input-field col s12 offset-s1 offset-m12">
                    <input type="submit" value="Sign In" className="btn submit-btn" />
                </div>
            </form>
        </div>
    );
};

export default SignupPage;