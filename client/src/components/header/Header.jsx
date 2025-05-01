export default function Header() {
    return (
        <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-wide">Code Snippet</h1>
                <nav className="space-x-6">
                    <a href="#" className="hover:text-gray-200">Home</a>
                    <a href="#" className="hover:text-gray-200">Snippets</a>
                    <a href="#" className="hover:text-gray-200">About</a>
                </nav>
            </div>
        </header>
    );
}
