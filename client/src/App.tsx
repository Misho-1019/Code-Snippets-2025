import { Link, Route, Routes, useLocation } from 'react-router'
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
import { ThemeContext } from './context/ThemeContext'
import useTheme from './hooks/useTheme'

function App() {
    const { isDark, toggleTheme } = useTheme()
    const location = useLocation()

    return (
        <ErrorBoundary>
            <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            <UserProvider>
                <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary-600 focus:rounded-md focus:shadow-md">
                    Skip to content
                </a>
                <Header />
                <main id="main-content" key={location.pathname} className="animate-fade-in" role="status">
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
                            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
                                <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">Page not found</p>
                                <Link to="/" className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition">Go Home</Link>
                            </div>
                        } />
                    </Routes>
                </main>
                <ToastContainer position="top-right" />
            </UserProvider>
            </ThemeContext.Provider>
        </ErrorBoundary>
    )
}

export default App
