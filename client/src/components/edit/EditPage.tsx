import { Navigate, useNavigate, useParams } from "react-router";
import { useEditSnippet, useSnippet } from "../../api/snippetApi";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";
import Spinner from "../Spinner";
import Breadcrumbs from "../Breadcrumbs";

const schema = yup.object({
    title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
    description: yup.string().required('Description is required'),
    code: yup.string().required('Code is required'),
    language: yup.string().required('Language is required'),
})

interface EditForm {
    title: string
    description: string
    code: string
    language: string
}

export default function EditSnippet() {
    const navigate = useNavigate();
    const { userId } = useAuth()
    const { snippetId } = useParams<{ snippetId: string }>()
    const { snippet, isLoading, error } = useSnippet(snippetId || '')
    const { edit } = useEditSnippet()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EditForm>({
        resolver: yupResolver(schema),
        values: snippet ? {
            title: snippet.title,
            description: snippet.description,
            code: snippet.code,
            language: snippet.language,
        } : undefined,
    })

    const submitHandler = async (data: EditForm) => {
        try {
            await edit(snippetId!, data as unknown as Record<string, string>)

            showToast('Successfully edited!', 'success')
            navigate(`/snippets/${snippetId}/details`)
        } catch (error) {
            showToast((error as Error).message, 'error')
        }
    }

    if (isLoading) return <Spinner className="mt-20" size="lg" />
    if (error || !snippet) return <div className="text-center mt-10 text-gray-500">Error loading snippet.</div>

    const isOwner = userId === snippet.creator

    if (!isOwner) {
        return <Navigate to='/snippets' />
    }

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white dark:bg-surface-800 shadow-lg rounded-lg">
            <Breadcrumbs items={[
                { label: 'Snippets', href: '/snippets' },
                { label: snippet.title, href: `/snippets/${snippetId}/details` },
                { label: 'Edit' },
            ]} />
            <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-6">Edit Snippet</h2>

            <form className="space-y-5" onSubmit={handleSubmit(submitHandler)} noValidate>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" {...register('title')}
                        className="w-full border border-gray-300 dark:border-surface-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea rows={3} {...register('description')}
                        className="w-full border border-gray-300 dark:border-surface-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                    <textarea rows={6} {...register('code')}
                        className="w-full font-mono border border-gray-300 dark:border-surface-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" />
                    {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                    <input type="text" {...register('language')}
                        className="w-full border border-gray-300 dark:border-surface-600 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100" />
                    {errors.language && <p className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
                </div>

                <div className="text-right">
                    <button type="submit" disabled={isSubmitting}
                        className="px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}
