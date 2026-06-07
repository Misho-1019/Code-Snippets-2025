import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router";
import { useEditSnippet, useSnippet, useTags } from "../../api/snippetApi";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";
import Spinner from "../Spinner";
import Breadcrumbs from "../Breadcrumbs";
import TagInput from "../catalog/TagInput";
import CodeEditor from "../CodeEditor";

const schema = yup.object({
    title: yup.string().min(3, 'Title must be at least 3 characters').required('Title is required'),
    description: yup.string().required('Description is required'),
    language: yup.string().required('Language is required'),
})

interface EditForm {
    title: string
    description: string
    language: string
}

export default function EditSnippet() {
    const navigate = useNavigate();
    const { userId } = useAuth()
    const { snippetId } = useParams<{ snippetId: string }>()
    const { snippet, isLoading, error } = useSnippet(snippetId || '')
    const { edit } = useEditSnippet()
    const { tags: suggestedTags } = useTags()
    const [tags, setTags] = useState<string[]>(snippet?.tags || [])
    const [visibility, setVisibility] = useState<string>(snippet?.visibility || 'private')
    const [code, setCode] = useState('')

    useEffect(() => {
        document.title = snippet ? `Edit ${snippet.title} — Code Snippet` : error ? 'Error loading snippet — Code Snippet' : 'Code Snippet'
    }, [snippet, error])

    useEffect(() => {
        if (snippet?.tags) setTags(snippet.tags)
        if (snippet) {
            setVisibility(snippet.visibility || 'private')
            setCode(snippet.code)
        }
    }, [snippet])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<EditForm>({
        resolver: yupResolver(schema),
        values: snippet ? {
            title: snippet.title,
            description: snippet.description,
            language: snippet.language,
        } : undefined,
    })

    const submitHandler = async (data: EditForm) => {
        if (!code.trim()) {
            showToast('Code is required', 'error')
            return
        }
        try {
            await edit(snippetId!, { ...data, code, tags, visibility } as unknown as Record<string, string>)

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
        <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800">
            <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-surface-800 shadow-lg rounded-lg">
            <Breadcrumbs items={[
                { label: 'Snippets', href: '/snippets' },
                { label: snippet.title, href: `/snippets/${snippetId}/details` },
                { label: 'Edit' },
            ]} />
            <h2 className="text-2xl font-bold text-primary-700 dark:text-primary-300 mb-6">Edit Snippet</h2>

            <form className="space-y-5" onSubmit={handleSubmit(submitHandler)} noValidate>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                    <input type="text" aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} {...register('title')}
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.title ? 'border-red-500' : touchedFields.title ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`} />
                    {errors.title && <p id="title-error" className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                    <textarea rows={3} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} {...register('description')}
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.description ? 'border-red-500' : touchedFields.description ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`} />
                    {errors.description && <p id="description-error" className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                    <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={undefined}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Language</label>
                    <input type="text" aria-invalid={!!errors.language} aria-describedby={errors.language ? 'language-error' : undefined} {...register('language')}
                        className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.language ? 'border-red-500' : touchedFields.language ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`} />
                    {errors.language && <p id="language-error" className="text-red-500 text-sm mt-1">{errors.language.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
                    <TagInput
                        tags={tags}
                        onChange={setTags}
                        suggestions={suggestedTags.map(t => t.name)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visibility</label>
                    <select
                        value={visibility}
                        onChange={e => setVisibility(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-surface-600 rounded-md focus:ring-2 focus:ring-primary-500 dark:bg-surface-700 dark:text-gray-100"
                    >
                        <option value="private">Private — only you</option>
                        <option value="public">Public — visible to everyone</option>
                    </select>
                </div>

                <div className="text-right">
                    <button type="submit" disabled={isSubmitting}
                        className="px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 active:scale-95 transition disabled:opacity-50">
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
}
