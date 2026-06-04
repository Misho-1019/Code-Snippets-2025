import { useNavigate } from "react-router";
import { useCreateSnippet } from "../../api/snippetApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";

const schema = yup.object({
    title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
    description: yup.string().required('Description is required'),
    code: yup.string().required('Code is required'),
    language: yup.string().required('Language is required'),
})

interface CreateForm {
    title: string
    description: string
    code: string
    language: string
}

export default function CreateSnippet() {
    const navigate = useNavigate();
    const { create } = useCreateSnippet()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateForm>({
        resolver: yupResolver(schema),
    })

    const submitHandler = async (data: CreateForm) => {
        try {
            await create(data as unknown as Record<string, string>)

            showToast('Successfully created!', 'success')
            navigate('/snippets')
        } catch (error) {
            showToast((error as Error).message, 'error')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-8 border-b pb-4">
                    Create New Snippet
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit(submitHandler)} noValidate>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                        <input type="text" id="title" {...register('title')}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Snippet title" />
                        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" rows={3} {...register('description')}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Brief description of your snippet" />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700">Code</label>
                        <textarea id="code" rows={6} {...register('code')}
                            className="mt-1 block w-full font-mono px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Paste your code here" />
                        {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
                        <input type="text" id="language" {...register('language')}
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., JavaScript, Python" />
                        {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting}
                            className="w-full md:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition disabled:opacity-50">
                            Create Snippet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
