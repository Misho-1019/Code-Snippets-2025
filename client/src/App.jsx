import { Route, Routes } from 'react-router'
import { useState } from 'react'
import './App.css'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'

function App() {
    const [email, setEmail] = useState('')

    const userLoginHandler = (authData) => {
        setEmail(authData.email)

        console.log(authData);
        
    }

    return (
        <>
            <div>
                <Header />

                <Routes>
                    <Route path='/' element={<Home />}/>
                    <Route path='/login' element={<Login onLogin={userLoginHandler}/>}/>
                    <Route path='/register' element={<Register />}/>
                </Routes>
            </div>
        </>
    )
}

export default App
