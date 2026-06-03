import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createTestApp } from './app.js'
import { createTestSnippet, createTestUser } from './helpers.js'

const app = createTestApp()

describe('Like Endpoints', () => {

    describe('POST /snippets/:snippetId/likes', () => {
        it('should like a snippet', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'u@example.com', password: 'password123' })

            const cookie = registerRes.headers['set-cookie']

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookie)
                .send({ title: 'Liked Snippet', description: 'desc', code: 'code', language: 'JS' })

            const res = await request(app)
                .post(`/snippets/${createRes.body._id}/likes`)
                .set('Cookie', cookie)

            expect(res.status).toBe(200)
            expect(res.body.likesCount).toBe(1)
            expect(res.body.likedByUser).toBe(true)
        })

        it('should unlike a previously liked snippet', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'u@example.com', password: 'password123' })

            const cookie = registerRes.headers['set-cookie']

            const createRes = await request(app)
                .post('/snippets/create')
                .set('Cookie', cookie)
                .send({ title: 'Unliked', description: 'desc', code: 'code', language: 'JS' })

            await request(app)
                .post(`/snippets/${createRes.body._id}/likes`)
                .set('Cookie', cookie)

            const res = await request(app)
                .post(`/snippets/${createRes.body._id}/likes`)
                .set('Cookie', cookie)

            expect(res.status).toBe(200)
            expect(res.body.likesCount).toBe(0)
            expect(res.body.likedByUser).toBe(false)
        })

        it('should return 401 without auth', async () => {
            const user = await createTestUser()
            const snippet = await createTestSnippet(user._id as string)

            const res = await request(app)
                .post(`/snippets/${snippet._id}/likes`)

            expect(res.status).toBe(401)
        })
    })
})
