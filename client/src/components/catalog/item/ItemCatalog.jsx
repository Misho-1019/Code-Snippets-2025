export default function ItemCatalog({
    _id,
    title,
    language,
    description,
    code,
}) {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
            <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                    Language: <span className="font-medium">{language}</span>
                </p>
                <p className="text-gray-700 text-sm mb-4">
                    {description}
                </p>
                <pre className="bg-gray-100 text-sm p-3 rounded-md overflow-x-auto text-gray-800 font-mono">
                    {code}
                </pre>
            </div>
            <div className="pt-4 flex justify-end gap-2">
                <button className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
                    Details
                </button>
            </div>
        </div>
    )
}