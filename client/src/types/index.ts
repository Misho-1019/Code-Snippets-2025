export interface Snippet {
    _id: string
    title: string
    description: string
    code: string
    language: string
    creator: string
    createdAt: string
    likes: string[]
}

export interface Comment {
    _id: string
    text: string
    creator: string | { _id: string; username: string }
    snippetId: string
    createdAt: string
}

export interface AuthData {
    token: string
    _id: string
    email: string
    username: string
}

export interface UserContextType extends AuthData {
    userLoginHandler: (data: AuthData) => void
    userLogoutHandler: () => void
}

export interface PaginatedResponse {
    snippets: Snippet[]
    totalPages: number
    currentPage: number
    totalSnippets: number
}

export interface LikeResult {
    likesCount: number
    likedByUser: boolean
}
