import { useEffect, useState } from "react";
import snippetService from "../../services/snippetService";
import ItemCatalog from "./item/ItemCatalog";

export default function SnippetList() {
    const [snippets, setSnippets] = useState([])

    useEffect(() => {
        snippetService.getAll()
            .then(setSnippets)
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-4">
                    Your Snippets
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {snippets.length > 0
                        ? snippets.map(snippet => <ItemCatalog key={snippet._id} {...snippet} />)
                        : <h3 className="text-center text-lg text-gray-600 font-medium mt-10">
                            No snippets yet
                          </h3>
                    }
                </div>

            </div>
        </div>
    );
}
