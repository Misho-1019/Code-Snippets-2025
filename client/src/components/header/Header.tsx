import { useContext, useState } from "react";
import { Link, useLocation } from "react-router";
import { UserContext } from "../../context/UserContext";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

function UserAvatar({ email, username }: { email: string; username: string }) {
    const initials = (username || email).slice(0, 2).toUpperCase()
    return (
        <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/20 text-white text-sm font-semibold"
            title={email}
        >
            {initials}
        </span>
    )
}

export default function Header() {
    const { email, username, isAuthLoading } = useContext(UserContext);
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [menuOpen, setMenuOpen] = useState(false)
    const location = useLocation()

    const linkClass = (path: string) =>
        `hover:text-gray-200 ${location.pathname === path ? 'font-semibold underline underline-offset-4' : ''}`

    const navLinks = email ? (
        <>
            <Link to="/snippets/create" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Create Snippet</Link>
            <div className="flex items-center gap-2">
                <UserAvatar email={email} username={username} />
                <Link to="/logout" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Logout</Link>
            </div>
        </>
    ) : (
        <>
            <Link to="/register" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Register</Link>
            <Link to="/login" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Login</Link>
        </>
    )

    return (
        <header className="bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-md sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide">Code Snippet</Link>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white active:scale-95 transition-transform"
                        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
                    </button>

                    <button
                        className="md:hidden p-2 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-white"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                    >
                        {menuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

                <nav className="hidden md:flex items-center space-x-6">
                    <Link to='/' className={linkClass('/')}>Home</Link>
                    <Link to="/snippets" className={linkClass('/snippets')}>Snippets</Link>
                    {isAuthLoading ? null : navLinks}
                </nav>
            </div>

            {menuOpen && (
                <nav className="md:hidden px-6 pb-4 flex flex-col space-y-3 bg-indigo-700">
                    <Link to='/' className={linkClass('/')} onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/snippets" className={linkClass('/snippets')} onClick={() => setMenuOpen(false)}>Snippets</Link>
                    {isAuthLoading ? null : navLinks}
                </nav>
            )}
        </header>
    );
}
