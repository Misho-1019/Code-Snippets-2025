import { Route, Routes } from 'react-router'
import './App.css'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Logout from './components/logout/Logout'
import { UserProvider } from './providers/UserProvider'
import AuthGuard from './components/guards/AuthGuard'

function App() {

    return (
        <>
            <UserProvider>
                <Header />

                <Routes>
                    <Route element={<AuthGuard />}>
                        <Route path='/logout' element={<Logout />} />
                    </Route>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                </Routes>
            </UserProvider>
        </>
    )
}

export default App
