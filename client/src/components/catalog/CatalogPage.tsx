import ItemCatalog from "./item/ItemCatalog";
import { useSnippets } from "../../api/snippetApi";

export default function SnippetList() {
    const { snippets } = useSnippets()

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-4">
                    Your Snippets
                </h2>

                {snippets.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {snippets.map(snippet => (
                            <ItemCatalog key={snippet._id} {...snippet} />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-inner">
                        <h3 className="text-xl text-gray-500 font-semibold">
                            No snippets yet
                        </h3>
                    </div>
                )}
            </div>
        </div>
    );
}
