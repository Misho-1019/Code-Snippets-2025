import { useEffect } from "react";
import { useParams, Link } from "react-router";
import request from "../../utils/request";
import { useState } from "react";
import type { Snippet } from "../../types";
import Spinner from "../Spinner";

interface UserProfile {
    _id: string;
    username: string;
    joinedAt: string;
    publicSnippets: number;
    snippets: Snippet[];
}

export default function UserProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.title = profile ? `${profile.username} — Code Snippet` : 'User Profile — Code Snippet';
    }, [profile]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        request.get(`/api/users/${username}`)
            .then(data => {
                setProfile(data as UserProfile);
                setIsLoading(false);
            })
            .catch(() => {
                setError('User not found');
                setIsLoading(false);
            });
    }, [username]);

    if (isLoading) return <div className="min-h-screen pt-20"><Spinner /></div>;

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <p className="text-red-500 text-lg">{error || 'User not found'}</p>
            <Link to="/snippets" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md">Back to Snippets</Link>
        </div>
    );

    return (
        <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8 mb-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                        {profile.username.slice(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">@{profile.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400">{profile.publicSnippets} public snippet{profile.publicSnippets !== 1 ? 's' : ''}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.snippets.map((snippet) => (
                        <Link key={snippet._id} to={`/snippets/${snippet._id}/details`} className="bg-white dark:bg-surface-800 shadow-md rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                            <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-300 mb-2">{snippet.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{snippet.description}</p>
                            <span className="text-xs bg-indigo-100 dark:bg-surface-700 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{snippet.language}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
