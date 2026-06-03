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

    if (data) {
        options = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            body: JSON.stringify(data),
        }
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
    get: request.bind(null, 'GET'),
    post: request.bind(null, 'POST'),
    put: request.bind(null, 'PUT'),
    delete: request.bind(null, 'DELETE'),
    baseRequest: request,
}
