import { Route, Routes } from 'react-router'
import './App.css'
import Header from './components/header/Header'
import Home from './components/home/Home'
import Login from './components/login/Login'
import Register from './components/register/Register'
import Logout from './components/logout/Logout'
import { UserProvider } from './providers/UserProvider'
import AuthGuard from './components/guards/AuthGuard'
import GuestGuard from './components/guards/GuestGuard'
import { ToastContainer } from "react-toastify";
import CreateSnippet from './components/create/CreatePage'
import SnippetList from './components/catalog/CatalogPage'
import SnippetDetails from './components/details/DetailsPage'
import EditSnippet from './components/edit/EditPage'

function App() {

    return (
        <>
            <UserProvider>
                <Header />

                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/snippets' element={<SnippetList />} />
                    <Route path='/snippets/:snippetId/details' element={<SnippetDetails />} />

                    <Route element={<AuthGuard />}>
                        <Route path='/logout' element={<Logout />} />
                        <Route path='/snippets/create' element={<CreateSnippet />} />
                        <Route path='/snippets/edit' element={<EditSnippet />} />
                    </Route>

                    <Route element={<GuestGuard />}>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Route>
                </Routes>

                <ToastContainer />
            </UserProvider>
        </>
    )
}

export default App
