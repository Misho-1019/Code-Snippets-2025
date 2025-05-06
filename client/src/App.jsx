import { Route, Routes } from 'react-router'
import './App.css'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { UserContext } from './context/UserContext'
import Logout from './components/logout/Logout'
import usePersistedState from './hooks/usePersistedState'

function App() {
    const [authData, setAuthData] = usePersistedState('auth', {})

    const userLoginHandler = (resultData) => {
        setAuthData(resultData)
    }

    const userLogoutHandler = () => {
        setAuthData({})
    }

    return (
        <>
            <UserContext.Provider value={{ ...authData, userLoginHandler, userLogoutHandler }}>
                <Header />

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/register' element={<Register />} />
                    <Route path='/logout' element={<Logout />} />
                </Routes>
            </UserContext.Provider>
        </>
    )
}

export default App
