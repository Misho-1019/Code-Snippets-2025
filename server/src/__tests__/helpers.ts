import User from '../models/User.js'
import Snippet from '../models/Snippet.js'
import Comment from '../models/Comment.js'

export const createTestUser = async () => {
    return User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
    })
}

export const createTestSnippet = async (creatorId: string) => {
    return Snippet.create({
        title: 'Test Snippet',
        description: 'A test snippet description',
        code: 'console.log("hello world")',
        language: 'JavaScript',
        creator: creatorId,
    })
}

export const createTestComment = async (snippetId: string, creatorId: string) => {
    return Comment.create({
        text: 'Test comment',
        creator: creatorId,
        snippetId: snippetId,
    })
}

export const loginUser = async (request: any) => {
    await createTestUser()
    const res = await request
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
    return res.body.token
}

export const createAndLoginUser = async (request: any) => {
    const res = await request
        .post('/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' })
    return res
}

export const getCookies = (res: any): string[] => {
    return res.headers['set-cookie'] || []
}
