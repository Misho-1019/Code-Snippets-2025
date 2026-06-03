import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createTestApp } from './app.js'
import { createTestUser } from './helpers.js'

const app = createTestApp()

describe('Auth Endpoints', () => {

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'newuser', email: 'new@example.com', password: 'password123' })

            expect(res.status).toBe(201)
            expect(res.body).toHaveProperty('token')
            expect(res.body).toHaveProperty('_id')
            expect(res.body.email).toBe('new@example.com')
            expect(res.body.username).toBe('newuser')
            expect(res.headers['set-cookie']).toBeDefined()
        })

        it('should reject duplicate email', async () => {
            await createTestUser()
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'another', email: 'test@example.com', password: 'password123' })

            expect(res.status).toBe(400)
            expect(res.body.message).toMatch(/already exists/i)
        })

        it('should reject invalid email', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'not-an-email', password: 'password123' })

            expect(res.status).toBe(400)
            expect(res.body.errors).toBeDefined()
        })

        it('should reject short password', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'user@example.com', password: '123' })

            expect(res.status).toBe(400)
            expect(res.body.errors).toBeDefined()
        })

        it('should reject missing fields', async () => {
            const res = await request(app)
                .post('/auth/register')
                .send({ email: 'user@example.com' })

            expect(res.status).toBe(400)
        })
    })

    describe('POST /auth/login', () => {
        it('should login with valid credentials', async () => {
            await createTestUser()
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'password123' })

            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('token')
            expect(res.headers['set-cookie']).toBeDefined()
        })

        it('should reject wrong password', async () => {
            await createTestUser()
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'test@example.com', password: 'wrongpassword' })

            expect(res.status).toBe(400)
        })

        it('should reject non-existent user', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ email: 'nobody@example.com', password: 'password123' })

            expect(res.status).toBe(400)
        })

        it('should reject missing email', async () => {
            const res = await request(app)
                .post('/auth/login')
                .send({ password: 'password123' })

            expect(res.status).toBe(400)
        })
    })

    describe('GET /auth/logout', () => {
        it('should logout authenticated user', async () => {
            const registerRes = await request(app)
                .post('/auth/register')
                .send({ username: 'user', email: 'user@example.com', password: 'password123' })

            const cookies = registerRes.headers['set-cookie']

            const res = await request(app)
                .get('/auth/logout')
                .set('Cookie', cookies)

            expect(res.status).toBe(200)
            expect(res.body.message).toMatch(/logout/i)
        })

        it('should reject unauthenticated logout', async () => {
            const res = await request(app).get('/auth/logout')
            expect(res.status).toBe(401)
        })
    })
})
