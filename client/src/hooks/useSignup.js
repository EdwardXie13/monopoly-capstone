import { useState, useContext } from 'react';

import backend from '../apis/backend';
import AuthContext from '../contexts/AuthContext';

const useSignup = () => {
    const [form, setForm] = useState({ email: '', password: '', Cpassword:''});
    const { setIsAuth } = useContext(AuthContext);
    
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = e => {
        e.preventDefault();
        backend.post('/auth/signup', form)
            .then(() => setIsAuth(true))
            .catch(() => setIsAuth(false));
    }

    return [handleChange, handleSubmit];
}

export default useSignup;