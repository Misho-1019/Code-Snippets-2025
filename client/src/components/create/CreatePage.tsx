import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useCreateSnippet, useTags } from "../../api/snippetApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { showToast } from "../../utils/toastUtils";
import Breadcrumbs from "../Breadcrumbs";
import TagInput from "../catalog/TagInput";
import CodeEditor from "../CodeEditor";
import { useThemeContext } from "../../context/ThemeContext";

function useUnsavedChanges(dirty: boolean) {
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (dirty) {
                e.preventDefault()
            }
        }
        window.addEventListener('beforeunload', handler)
        return () => window.removeEventListener('beforeunload', handler)
    }, [dirty])
}

interface CreateForm {
    title: string
    description: string
    language: string
}

export default function CreateSnippet() {
    const navigate = useNavigate();
    const { create } = useCreateSnippet()
    const { tags: suggestedTags } = useTags()
    const { isDark } = useThemeContext()
    const [tags, setTags] = useState<string[]>([])
    const [visibility, setVisibility] = useState('private')
    const [code, setCode] = useState('')
    const dirty = code.trim() !== '' || tags.length > 0
    useUnsavedChanges(dirty)

    useEffect(() => {
        document.title = 'Create Snippet — Code Snippet'
    }, [])

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<CreateForm>({
        resolver: yupResolver(schema),
    })

    const submitHandler = async (data: CreateForm) => {
        if (!code.trim()) {
            showToast('Code is required', 'error')
            return
        }
        try {
            await create({ ...data, code, tags, visibility } as unknown as Record<string, string>)

            showToast('Successfully created!', 'success')
            navigate('/snippets')
        } catch (error) {
            showToast((error as Error).message, 'error')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-surface-900 dark:to-surface-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8">
                <Breadcrumbs items={[
                    { label: 'Snippets', href: '/snippets' },
                    { label: 'Create' },
                ]} />
                <h2 className="text-3xl font-extrabold text-primary-700 dark:text-primary-300 mb-8 border-b dark:border-surface-600 pb-4">
                    Create New Snippet
                </h2>

                <form className="space-y-6" onSubmit={handleSubmit(submitHandler)} noValidate>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                        <input type="text" id="title" aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} {...register('title')}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.title ? 'border-red-500' : touchedFields.title ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`}
                            placeholder="Snippet title" />
                        {errors.title && <p id="title-error" className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <textarea id="description" rows={3} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} {...register('description')}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.description ? 'border-red-500' : touchedFields.description ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`}
                            placeholder="Brief description of your snippet" />
                        {errors.description && <p id="description-error" className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Code</label>
                        <CodeEditor
                            value={code}
                            onChange={setCode}
                            isDark={isDark}
                        />
                    </div>

                    <div>
                        <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
                        <input type="text" id="language" aria-invalid={!!errors.language} aria-describedby={errors.language ? 'language-error' : undefined} {...register('language')}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-surface-700 dark:text-gray-100 ${errors.language ? 'border-red-500' : touchedFields.language ? 'border-green-500' : 'border-gray-300 dark:border-surface-600'}`}
                            placeholder="e.g., JavaScript, Python" />
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

                    <div className="pt-4">
                        <button type="submit" disabled={isSubmitting}
                            className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white font-semibold rounded-md hover:bg-primary-700 active:scale-95 transition disabled:opacity-50">
                            {isSubmitting ? 'Creating...' : 'Create Snippet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
