import { Link } from "react-router";

export default function Header() {
    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-wide">Code Snippet</h1>
                <nav className="space-x-6">
                    <Link to='/' className="hover:text-gray-200">Home</Link>
                    <Link to="/snippets" className="hover:text-gray-200">Snippets</Link>
                    <Link to="/register" className="hover:text-gray-200">Register</Link>
                    <Link to="/login" className="hover:text-gray-200">Login</Link>
                    <Link to="/logout" className="hover:text-gray-200">Logout</Link>
                </nav>
            </div>
        </header>
    );
}
