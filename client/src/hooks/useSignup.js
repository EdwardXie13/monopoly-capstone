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
        if (form.password === form.Cpassword) {
            e.preventDefault();
            backend.post('/signup', form)
                .then(() => setIsAuth(true))
                .catch(() => setIsAuth(false));
        } else {
            MessageChannel.error('adad');
        }
    }

    return [handleChange, handleSubmit];
}

export default useSignup;