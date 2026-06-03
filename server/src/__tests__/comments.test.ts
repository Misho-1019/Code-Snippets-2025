import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createTestApp } from './app.js'
import { createTestSnippet, createTestUser } from './helpers.js'

const app = createTestApp()

const registerAndGetCookie = async () => {
    const res = await request(app)
        .post('/auth/register')
        .send({ username: 'user', email: 'u@example.com', password: 'password123' })
    return res.headers['set-cookie']
}

describe('Comment Endpoints', () => {

    describe('GET /snippets/:snippetId/comments', () => {
        it('should return empty list when no comments', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)

            const res = await request(app).get(`/snippets/${snippet._id}/comments`)
            expect(res.status).toBe(200)
            expect(res.body).toEqual([])
        })

        it('should return comments for a snippet', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)
            const cookie = await registerAndGetCookie()

            await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .set('Cookie', cookie)
                .send({ text: 'Great snippet!' })

            const res = await request(app).get(`/snippets/${snippet._id}/comments`)
            expect(res.status).toBe(200)
            expect(res.body).toHaveLength(1)
            expect(res.body[0].text).toBe('Great snippet!')
        })
    })

    describe('POST /snippets/:snippetId/comments', () => {
        it('should create a comment when authenticated', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)
            const cookie = await registerAndGetCookie()

            const res = await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .set('Cookie', cookie)
                .send({ text: 'Nice code!' })

            expect(res.status).toBe(201)
            expect(res.body.text).toBe('Nice code!')
        })

        it('should reject comment without auth', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)

            const res = await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .send({ text: 'Nice code!' })

            expect(res.status).toBe(401)
        })

        it('should reject empty comment text', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)
            const cookie = await registerAndGetCookie()

            const res = await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .set('Cookie', cookie)
                .send({ text: '' })

            expect(res.status).toBe(400)
        })
    })

    describe('DELETE /snippets/:snippetId/comments/:commentId', () => {
        it('should delete a comment', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)
            const cookie = await registerAndGetCookie()

            const commentRes = await request(app)
                .post(`/snippets/${snippet._id}/comments`)
                .set('Cookie', cookie)
                .send({ text: 'To delete' })

            const res = await request(app)
                .delete(`/snippets/${snippet._id}/comments/${commentRes.body._id}`)
                .set('Cookie', cookie)

            expect(res.status).toBe(200)
        })

        it('should return 404 for non-existent comment', async () => {
            const cookie = await registerAndGetCookie()

            const res = await request(app)
                .delete('/snippets/507f1f77bcf86cd799439011/comments/507f1f77bcf86cd799439012')
                .set('Cookie', cookie)

            expect(res.status).toBe(404)
        })
    })
})
