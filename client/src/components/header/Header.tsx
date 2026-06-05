import { useContext, useState } from "react";
import { Link } from "react-router";
import { UserContext } from "../../context/UserContext";

export default function Header() {
    const { email, isAuthLoading } = useContext(UserContext);
    const [menuOpen, setMenuOpen] = useState(false)

    const navLinks = email ? (
        <>
            <Link to="/snippets/create" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Create Snippet</Link>
            <Link to="/logout" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Logout</Link>
        </>
    ) : (
        <>
            <Link to="/register" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Register</Link>
            <Link to="/login" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Login</Link>
        </>
    )

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wide">Code Snippet</Link>

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

                <nav className="hidden md:flex items-center space-x-6">
                    <Link to='/' className="hover:text-gray-200">Home</Link>
                    <Link to="/snippets" className="hover:text-gray-200">Snippets</Link>
                    {isAuthLoading ? null : navLinks}
                </nav>
            </div>

            {menuOpen && (
                <nav className="md:hidden px-6 pb-4 flex flex-col space-y-3 bg-indigo-700">
                    <Link to='/' className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/snippets" className="hover:text-gray-200" onClick={() => setMenuOpen(false)}>Snippets</Link>
                    {isAuthLoading ? null : navLinks}
                </nav>
            )}
        </header>
    );
}
