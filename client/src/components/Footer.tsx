import { FaReact } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-primary-600 to-purple-600 text-white py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
                <p>&copy; {new Date().getFullYear()} Code Snippet. All rights reserved.</p>
                <span className="flex items-center gap-1.5 text-white/80">
                    <FaReact className="w-4 h-4" />
                    Built with React
                </span>
            </div>
        </footer>
    );
}
