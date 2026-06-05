import { Link } from "react-router";

interface ItemCatalogProps {
    _id: string
    title: string
    language: string
    description: string
    code: string
}

export default function ItemCatalog({ _id, title, language, description, code }: ItemCatalogProps) {
    return (
        <div className="bg-white dark:bg-surface-800 shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="text-xl font-semibold text-primary-600 dark:text-primary-300 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Language: <span className="font-medium">{language}</span>
                </p>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">
                    {description}
                </p>
                <pre className="bg-gray-100 dark:bg-surface-900 text-sm p-3 rounded-md overflow-x-auto text-gray-800 dark:text-gray-200 font-mono">
                    {code}
                </pre>
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <Link to={`/snippets/${_id}/details`} className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 transition-colors">
                    Details
                </Link>
            </div>
        </div>
    )
}
