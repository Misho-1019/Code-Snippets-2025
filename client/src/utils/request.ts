function getCookie(name: string): string | undefined {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(';').shift()
    return undefined
}

interface RequestOptions {
    headers?: Record<string, string>
    signal?: AbortSignal
    [key: string]: unknown
}

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

const request = async (method: RequestMethod, url: string, data?: unknown, options: RequestOptions = {}): Promise<unknown> => {
    if (method !== 'GET') {
        options.method = method
    }

    const csrfToken = getCookie('csrf-token')
    const headers: Record<string, string> = {
        ...(csrfToken ? { 'X-CSRF-Token': csrfToken } : {}),
        ...options.headers,
    }

    if (data) {
        headers['Content-Type'] = 'application/json'
        options = {
            ...options,
            headers,
            body: JSON.stringify(data),
        }
    } else {
        options = { ...options, headers }
    }

    options = {
        credentials: 'include' as RequestCredentials,
        ...options,
    }

    const response = await fetch(url, options as RequestInit)

    if (!response.ok) {
        let errorResult: unknown
        try {
            errorResult = await response.json()
        } catch {
            errorResult = { message: `HTTP ${response.status}: ${response.statusText}` }
        }
        throw errorResult
    }

    const contentType = response.headers.get('Content-Type')
    if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text()
        return text || null
    }

    return await response.json()
}

export default {
    get: (url: string, options?: RequestOptions) => request('GET', url, undefined, options),
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    delete: request.bind(null, 'DELETE'),
    baseRequest: request,
}
