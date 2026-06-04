import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createTestApp } from './app.js'
import { createTestSnippet, createTestUser } from './helpers.js'
import Snippet from '../models/Snippet.js'
import Comment from '../models/Comment.js'

const app = createTestApp()

const registerAndGetCookie = async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ username: 'user', email: 'u@example.com', password: 'password123' })
    return res.headers['set-cookie']
}

describe('Snippet Endpoints', () => {

    describe('GET /snippets', () => {
        it('should return empty list when no snippets', async () => {
            const res = await request(app).get('/snippets')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toEqual([])
            expect(res.body.totalSnippets).toBe(0)
        })

        it('should return all snippets with pagination', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toHaveLength(1)
            expect(res.body).toHaveProperty('totalPages')
            expect(res.body).toHaveProperty('currentPage')
        })

        it('should filter by language', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets?language=JavaScript')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toHaveLength(1)
        })

        it('should filter by non-existent language', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets?language=Python')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toHaveLength(0)
        })
    })

    describe('GET /snippets/latest', () => {
        it('should return latest snippets', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets/latest')
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
        })

        it('should return 404 when no snippets exist', async () => {
            const res = await request(app).get('/snippets/latest')
            expect(res.status).toBe(404)
        })
    })

    describe('GET /snippets/:snippetId', () => {
        it('should return a snippet by ID', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)

            const res = await request(app).get(`/snippets/${snippet._id}`)
            expect(res.status).toBe(200)
            expect(res.body.title).toBe('Test Snippet')
        })

        it('should return 404 for non-existent snippet', async () => {
            const res = await request(app).get('/snippets/507f1f77bcf86cd799439011')
            expect(res.status).toBe(404)
        })
    })

    describe('POST /snippets/create', () => {
        it('should create a snippet when authenticated', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'user@example.com', password: 'password123' })

            const cookies = registerRes.headers['set-cookie']

            const res = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookies)
                .send({
                    title: 'New Snippet',
                    description: 'A new snippet',
                    code: 'const x = 1;',
                    language: 'JavaScript',
                })

            expect(res.status).toBe(201)
            expect(res.body.title).toBe('New Snippet')
        })

        it('should reject create without auth', async () => {
            const res = await request(app)
                .post('/snippets/create')
                .send({
                    title: 'New Snippet',
                    description: 'A new snippet',
                    code: 'const x = 1;',
                    language: 'JavaScript',
                })

            expect(res.status).toBe(401)
        })

        it('should reject create with missing fields', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'u@example.com', password: 'password123' })

            const res = await request(app)
                .post('/snippets/create')
                .set('Cookie', registerRes.headers['set-cookie'])
                .send({ title: 'Incomplete' })

            expect(res.status).toBe(400)
        })
    })

    describe('PUT /snippets/:snippetId', () => {
        it('should update own snippet', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'u@example.com', password: 'password123' })

            const cookie = registerRes.headers['set-cookie']

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookie)
                .send({ title: 'Original', description: 'desc', code: 'code', language: 'JS' })

            const res = await request(app)
                .put(`/snippets/${createRes.body._id}`)
                .set('Cookie', cookie)
                .send({ title: 'Updated' })

            expect(res.status).toBe(200)
            expect(res.body.title).toBe('Updated')
        })

        it('should reject update by non-owner', async () => {
            const user1 = await request(app)
                .post('/auth/register')
                .send({ username: 'user1', email: 'u1@example.com', password: 'password123' })

            const cookie1 = user1.headers['set-cookie']

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookie1)
                .send({ title: 'Original', description: 'desc', code: 'code', language: 'JS' })

            const user2 = await request(app)
                .post('/auth/register')
                .send({ username: 'user2', email: 'u2@example.com', password: 'password123' })

            const res = await request(app)
                .put(`/snippets/${createRes.body._id}`)
                .set('Cookie', user2.headers['set-cookie'])
                .send({ title: 'Hacked' })

            expect(res.status).toBe(403)
        })

        it('should reject update without auth', async () => {
            const res = await request(app)
                .put('/snippets/507f1f77bcf86cd799439011')
                .send({ title: 'Hacked' })

            expect(res.status).toBe(401)
        })
    })

    describe('DELETE /snippets/:snippetId', () => {
        it('should delete own snippet', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'u@example.com', password: 'password123' })

            const cookie = registerRes.headers['set-cookie']

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookie)
                .send({ title: 'To Delete', description: 'desc', code: 'code', language: 'JS' })

            const res = await request(app)
                .delete(`/snippets/${createRes.body._id}`)
                .set('Cookie', cookie)

            expect(res.status).toBe(200)
        })

        it('should reject delete by non-owner', async () => {
            const user1 = await request(app)
                .post('/auth/register')
                .send({ username: 'user1', email: 'u1@example.com', password: 'password123' })

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', user1.headers['set-cookie'])
                .send({ title: 'Mine', description: 'desc', code: 'code', language: 'JS' })

            const user2 = await request(app)
                .post('/auth/register')
                .send({ username: 'user2', email: 'u2@example.com', password: 'password123' })

            const res = await request(app)
                .delete(`/snippets/${createRes.body._id}`)
                .set('Cookie', user2.headers['set-cookie'])

            expect(res.status).toBe(403)
        })
    })

    describe('Pagination boundaries', () => {
        it('should reject page 0 as invalid', async () => {
            const res = await request(app).get('/snippets?page=0')
            expect(res.status).toBe(400)
        })

        it('should reject negative page as invalid', async () => {
            const res = await request(app).get('/snippets?page=-1')
            expect(res.status).toBe(400)
        })

        it('should return empty array for out-of-range page', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets?page=999')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toEqual([])
        })
    })

    describe('Cascade delete', () => {
        it('should delete comments when snippet is deleted', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'cascadeuser', email: 'cascade@example.com', password: 'password123' })
            const cookie = registerRes.headers['set-cookie']
            const userId = registerRes.body._id

            const snippet = await createTestSnippet(userId)
            expect(snippet).toBeDefined()

            await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .set('Cookie', cookie)
                .send({ text: 'Comment to cascade' })

            const deleteRes = await request(app)
                .delete(`/snippets/${snippet._id}`)
                .set('Cookie', cookie)

            expect(deleteRes.status).toBe(200)

            const remainingComments = await Comment.find({ snippetId: snippet._id })
            expect(remainingComments).toHaveLength(0)
        })
    })

    describe('Text search', () => {
        it('should find snippets matching search text', async () => {
            const user = await createTestUser()
            await Snippet.create({
                title: 'React Hooks Guide',
                description: 'A comprehensive guide to React hooks',
                code: 'useState()',
                language: 'JavaScript',
                creator: user._id,
            })
            await Snippet.create({
                title: 'Python Basics',
                description: 'Learn Python fundamentals',
                code: 'print("hello")',
                language: 'Python',
                creator: user._id,
            })

            const res = await request(app).get('/snippets?search=React')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toHaveLength(1)
            expect(res.body.snippets[0].title).toBe('React Hooks Guide')
        })

        it('should return empty list for non-matching search', async () => {
            const user = await createTestUser()
            await createTestSnippet(user._id as string)

            const res = await request(app).get('/snippets?search=NonExistentTerm')
            expect(res.status).toBe(200)
            expect(res.body.snippets).toHaveLength(0)
        })
    })
})
