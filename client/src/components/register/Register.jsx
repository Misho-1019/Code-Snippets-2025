export default function Register() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md bg-white p-8 shadow-md rounded-2xl">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Create an Account</h2>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Repeat Password</label>
                        <input type="password" className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                        Register
                    </button>
                </form>
            </div>
        </main>
    );
}
