import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from '../utils/request'

const createMockResponse = (overrides: Partial<Response> = {}): Response => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    json: vi.fn().mockResolvedValue({ data: 'test' }),
    text: vi.fn().mockResolvedValue('plain text'),
    ...overrides,
} as Response)

describe('request utility', () => {
    beforeEach(() => {
        vi.restoreAllMocks()
    })

    describe('GET', () => {
        it('makes a GET request and returns JSON', async () => {
            const mockData = { id: 1, name: 'test' }
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse({ json: vi.fn().mockResolvedValue(mockData) })
            )

            const result = await request.get('/api/test')
            expect(result).toEqual(mockData)
            expect(fetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
                credentials: 'include',
            }))
        })

        it('throws parsed error response on 4xx', async () => {
            const errorBody = { message: 'Not found' }
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse({
                    ok: false,
                    status: 404,
                    statusText: 'Not Found',
                    json: vi.fn().mockResolvedValue(errorBody),
                })
            )

            await expect(request.get('/api/not-found')).rejects.toEqual(errorBody)
        })

        it('throws generic error on non-JSON error response', async () => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse({
                    ok: false,
                    status: 500,
                    statusText: 'Internal Server Error',
                    headers: new Headers({}),
                    json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
                })
            )

            await expect(request.get('/api/error')).rejects.toEqual({
                message: 'HTTP 500: Internal Server Error',
            })
        })

        it('returns null for 204 No Content', async () => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse({
                    status: 204,
                    headers: new Headers({}),
                    text: vi.fn().mockResolvedValue(''),
                })
            )

            const result = await request.get('/api/empty')
            expect(result).toBeNull()
        })

        it('includes Content-Type header for POST with data', async () => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse()
            )

            await request.post('/api/create', { name: 'test' })
            expect(fetch).toHaveBeenCalledWith(
                '/api/create',
                expect.objectContaining({
                    method: 'POST',
                    headers: expect.objectContaining({
                        'Content-Type': 'application/json',
                    }),
                    body: JSON.stringify({ name: 'test' }),
                })
            )
        })

        it('handles non-JSON content type', async () => {
            vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
                createMockResponse({
                    headers: new Headers({ 'Content-Type': 'text/plain' }),
                    text: vi.fn().mockResolvedValue('plain response'),
                })
            )

            const result = await request.get('/api/text')
            expect(result).toBe('plain response')
        })
    })
})
