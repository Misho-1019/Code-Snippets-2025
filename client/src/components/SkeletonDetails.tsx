export default function SkeletonDetails() {
    return (
        <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-surface-800 shadow-lg rounded-lg animate-pulse">
                <div className="h-4 w-48 bg-gray-200 dark:bg-surface-700 rounded mb-6" />
                <div className="h-8 w-3/4 bg-gray-200 dark:bg-surface-700 rounded mb-6" />
                <div className="h-4 w-20 bg-gray-200 dark:bg-surface-700 rounded-full mb-6" />
                <div className="space-y-2 mb-6">
                    <div className="h-4 w-full bg-gray-200 dark:bg-surface-700 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 dark:bg-surface-700 rounded" />
                </div>
                <div className="h-64 w-full bg-gray-200 dark:bg-surface-700 rounded-lg mb-6" />
                <div className="flex justify-between">
                    <div className="h-10 w-24 bg-gray-200 dark:bg-surface-700 rounded-lg" />
                    <div className="flex gap-2">
                        <div className="h-10 w-20 bg-gray-200 dark:bg-surface-700 rounded-md" />
                        <div className="h-10 w-20 bg-gray-200 dark:bg-surface-700 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
