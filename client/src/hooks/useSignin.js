import { useState, useContext } from 'react';

import backend from '../apis/backend';
import AuthContext from '../contexts/AuthContext';
import history from '../utilities/history';

const useSignup = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const { setIsAuth } = useContext(AuthContext);
    
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    const handleSubmit = e => {
        e.preventDefault();
        backend.post('/auth/signin', form)
            .then(() => {
                setIsAuth(true);
                history.push('/lobby');
            })
            .catch(() => setIsAuth(false));
    }

    return [handleChange, handleSubmit];
}

export default useSignup;