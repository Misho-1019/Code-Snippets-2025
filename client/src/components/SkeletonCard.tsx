export default function SkeletonCard() {
    return (
        <div className="bg-white dark:bg-surface-800 shadow-md rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-surface-600 rounded w-3/4 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-surface-600 rounded w-1/4 mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-surface-600 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 dark:bg-surface-600 rounded w-2/3 mb-4" />
            <div className="h-20 bg-gray-200 dark:bg-surface-600 rounded mb-4" />
            <div className="flex justify-end">
                <div className="h-8 bg-gray-200 dark:bg-surface-600 rounded w-20" />
            </div>
        </div>
    )
}
