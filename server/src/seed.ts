import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from './models/User.js'
import Snippet from './models/Snippet.js'
import Comment from './models/Comment.js'

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string)
        console.log('Connected to MongoDB')

        // Clear existing data
        await Promise.all([
            User.deleteMany({}),
            Snippet.deleteMany({}),
            Comment.deleteMany({}),
        ])
        console.log('Cleared existing data')

        // Create users
        const alice = await User.create({
            username: 'alice',
            email: 'alice@example.com',
            password: 'password123',
        })

        const bob = await User.create({
            username: 'bob',
            email: 'bob@example.com',
            password: 'password123',
        })
        console.log('Created users: alice, bob')

        // Create snippets
        const jsSnippet = await Snippet.create({
            title: 'Hello World',
            description: 'A simple hello world in JavaScript',
            code: 'console.log("Hello, World!");',
            language: 'JavaScript',
            creator: alice._id,
        })

        const pySnippet = await Snippet.create({
            title: 'Fibonacci Sequence',
            description: 'Generate fibonacci numbers in Python',
            code: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        print(a)\n        a, b = b, a + b',
            language: 'Python',
            creator: alice._id,
        })

        const tsSnippet = await Snippet.create({
            title: 'TypeScript Interface',
            description: 'Example of a TypeScript interface',
            code: 'interface User {\n    id: string;\n    name: string;\n    email: string;\n}',
            language: 'TypeScript',
            creator: bob._id,
        })

        const reactSnippet = await Snippet.create({
            title: 'React Component',
            description: 'A functional React component with hooks',
            code: 'const Counter = () => {\n    const [count, setCount] = useState(0);\n    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n};',
            language: 'JavaScript',
            creator: bob._id,
        })

        const cssSnippet = await Snippet.create({
            title: 'Flexbox Center',
            description: 'Center content with CSS Flexbox',
            code: '.container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    height: 100vh;\n}',
            language: 'CSS',
            creator: alice._id,
        })

        const snippetCount = 5

        console.log(`Created ${snippetCount} snippets`)

        // Create comments
        await Comment.create({
            text: 'Great snippet! Very helpful for beginners.',
            creator: bob._id,
            snippetId: jsSnippet._id,
        })

        await Comment.create({
            text: 'You could also use a generator for this.',
            creator: alice._id,
            snippetId: pySnippet._id,
        })

        await Comment.create({
            text: 'Nice, clean TypeScript example.',
            creator: alice._id,
            snippetId: tsSnippet._id,
        })

        console.log('Created 3 comments')

        // Add likes
        ;(jsSnippet.likes as any).push(bob._id)
        ;(pySnippet.likes as any).push(alice._id)
        ;(tsSnippet.likes as any).push(alice._id, bob._id)
        ;(reactSnippet.likes as any).push(alice._id)

        await Promise.all([
            jsSnippet.save(),
            pySnippet.save(),
            tsSnippet.save(),
            reactSnippet.save(),
        ])

        console.log('Added likes to snippets')
        console.log('\nSeed completed successfully!')
        console.log('\nDemo accounts:')
        console.log('  alice@example.com / password123')
        console.log('  bob@example.com / password123')

        await mongoose.disconnect()
        process.exit(0)
    } catch (error) {
        console.error('Seed failed:', error)
        process.exit(1)
    }
}

seed()
