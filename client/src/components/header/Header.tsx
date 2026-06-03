import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../context/UserContext";

export default function Header() {
    const { email } = useContext(UserContext);

    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-wide">Code Snippet</h1>

                <nav className="flex items-center space-x-6">
                    <Link to='/' className="hover:text-gray-200">Home</Link>
                    <Link to="/snippets" className="hover:text-gray-200">Snippets</Link>

                    {email ? (
                        <>
                            <Link to="/snippets/create" className="hover:text-gray-200">Create Snippet</Link>
                            <Link to="/logout" className="hover:text-gray-200">Logout</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/register" className="hover:text-gray-200">Register</Link>
                            <Link to="/login" className="hover:text-gray-200">Login</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
