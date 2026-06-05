import { Link, Route, Routes } from 'react-router'
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
import CommentsPage from './components/comments/CommentPage'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
    return (
        <ErrorBoundary>
            <UserProvider>
                <Header />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/snippets' element={<SnippetList />} />
                    <Route path='/snippets/:snippetId/details' element={<SnippetDetails />} />

                    <Route element={<AuthGuard />}>
                        <Route path='/logout' element={<Logout />} />
                        <Route path='/snippets/create' element={<CreateSnippet />} />
                        <Route path='/snippets/:snippetId/edit' element={<EditSnippet />} />
                        <Route path='/snippets/:snippetId/comments' element={<CommentsPage />} />
                    </Route>

                    <Route element={<GuestGuard />}>
                        <Route path='/login' element={<Login />} />
                        <Route path='/register' element={<Register />} />
                    </Route>

                    <Route path='*' element={
                        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
                            <p className="text-xl text-gray-600 mb-6">Page not found</p>
                            <Link to="/" className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Go Home</Link>
                        </div>
                    } />
                </Routes>
                <ToastContainer />
            </UserProvider>
        </ErrorBoundary>
    )
}

export default App
