import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import request from "../../utils/request";
import type { Snippet } from "../../types";
import Spinner from "../Spinner";
import { showToast } from "../../utils/toastUtils";

interface LanguageCount {
    _id: string;
    count: number;
}

interface UserProfile {
    _id: string;
    username: string;
    joinedAt: string;
    publicSnippets: number;
    totalLikes: number;
    topLanguage: string | null;
    languageCounts: LanguageCount[];
    snippets: Snippet[];
}

export default function UserProfilePage() {
    const { username } = useParams<{ username: string }>();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState('newest');
    const [filterLang, setFilterLang] = useState('');

    useEffect(() => {
        document.title = profile ? `${profile.username} — Code Snippet` : 'User Profile — Code Snippet';
    }, [profile]);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (sortBy !== 'newest') params.set('sort', sortBy);
        if (filterLang) params.set('language', filterLang);
        const qs = params.toString() ? '?' + params.toString() : '';
        request.get(`/api/users/${username}${qs}`)
            .then(data => {
                setProfile(data as UserProfile);
                setIsLoading(false);
            })
            .catch(() => {
                setError('User not found');
                setIsLoading(false);
            });
    }, [username, sortBy, filterLang]);

    if (isLoading) return <div className="min-h-screen pt-20"><Spinner /></div>;

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3">
            <p className="text-red-500 text-lg">{error || 'User not found'}</p>
            <Link to="/snippets" className="px-4 py-2 text-sm bg-primary-600 text-white rounded-md">Back to Snippets</Link>
        </div>
    );

    const uniqueLanguages = [...new Set(profile.snippets.map(s => s.language))];

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-yellow-500', 'bg-red-500', 'bg-pink-500'];
    const textColors = ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-yellow-500', 'text-red-500', 'text-pink-500'];
    const totalLangCount = profile.languageCounts.reduce((s, l) => s + l.count, 0);

    return (
        <div className="min-h-screen py-16 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8 mb-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-primary-600 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                        {profile.username.slice(0, 2).toUpperCase()}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">@{profile.username}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mb-3">{profile.publicSnippets} public snippet{profile.publicSnippets !== 1 ? 's' : ''}</p>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            showToast('Profile link copied!', 'success');
                        }}
                        className="px-4 py-1.5 text-sm text-primary-600 border border-primary-600 rounded-md hover:bg-primary-50 dark:hover:bg-surface-700 transition"
                    >
                        Copy Profile Link
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm text-center">
                        <p className="text-2xl font-bold text-primary-600">{profile.publicSnippets}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Snippets</p>
                    </div>
                    <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm text-center">
                        <p className="text-2xl font-bold text-primary-600">{profile.totalLikes}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Likes received</p>
                    </div>
                    <div className="bg-white dark:bg-surface-800 rounded-xl p-5 shadow-sm text-center">
                        <p className="text-2xl font-bold text-primary-600">{profile.topLanguage || '—'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Top language</p>
                    </div>
                </div>

                {profile.languageCounts && profile.languageCounts.length > 1 && (
                    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm mb-8">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Languages</h3>
                        <div className="flex h-6 rounded-full overflow-hidden">
                            {profile.languageCounts.map((lang, i) => (
                                <div
                                    key={lang._id}
                                    className={colors[i % colors.length]}
                                    style={{ width: `${(lang.count / totalLangCount) * 100}%` }}
                                    title={`${lang._id}: ${lang.count}`}
                                />
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            {profile.languageCounts.map((lang, i) => (
                                <span key={lang._id} className={textColors[i % textColors.length]}>
                                    ● {lang._id} ({lang.count})
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex gap-3 mb-6">
                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-md text-sm bg-white dark:bg-surface-700 dark:text-gray-100"
                    >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="alpha">Alphabetical</option>
                    </select>
                    {uniqueLanguages.length > 1 && (
                        <select
                            value={filterLang}
                            onChange={e => setFilterLang(e.target.value)}
                            className="px-3 py-2 border border-gray-300 dark:border-surface-600 rounded-md text-sm bg-white dark:bg-surface-700 dark:text-gray-100"
                        >
                            <option value="">All Languages</option>
                            {uniqueLanguages.map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                    )}
                </div>

                {profile.snippets.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 dark:text-gray-500 italic">
                        {filterLang ? 'No snippets match this language.' : 'No public snippets yet.'}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.snippets.map((snippet) => (
                            <Link key={snippet._id} to={`/snippets/${snippet._id}/details`} className="bg-white dark:bg-surface-800 shadow-md rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
                                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-300 mb-2">{snippet.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{snippet.description}</p>
                                <span className="text-xs bg-indigo-100 dark:bg-surface-700 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">{snippet.language}</span>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
