import React, { useEffect, useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
const Login = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
        localStorage.setItem('token', token);
      navigate('/');
    }
  }, [navigate]);
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };



const handleLogin = () => {
    const user = {
        email: email,
        password: password,
    };

    fetch('https://monkfish-app-z9uza.ondigitalocean.app/bcard2/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    .then(response => response.text())
    .then(token => {
        const token2: { isAdmin: boolean, isBusiness: boolean, _id: string } = jwtDecode(token);
        navigate('/');
        
        localStorage.setItem('token', token); 
    })
    .catch((error) => console.error('Error:', error));
};

    return (
        <>
        <Header />
        <div className='flex  justify-center items-center '>
            <div className='w-1/3 bg-gray-300 dark:bg-gray-400 rounded-lg p-5 mt-10 mb-10 text-center'>
            <h2 className='text-2xl font-semibold '>Login</h2>
            <form>
                <div>
                    <input type="email" id="email" placeholder='Enter your email address' value={email} onChange={handleEmailChange} className='text-left px-5 py-2 rounded-lg border border-gray-400 mb-2 mt-5' />
                    
                </div>
                <div>
                    <input type="password" id="password"  placeholder='Enter your password' value={password} onChange={handlePasswordChange} className='text-left px-5 py-2 rounded-lg border border-gray-400' />
                    
                </div>
                <button type="button" onClick={handleLogin} className='p-2 bg-green-700 rounded-lg border-gray-400 bprder mt-2 hover:bg-green-800 transition-all duration-200'>Login</button>
            </form>
            </div>
        </div>
            <Footer />
            </>
    );
};

export default Login;