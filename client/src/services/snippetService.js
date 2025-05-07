const baseUrl = 'http://localhost:3030/snippets'

export default {
    async create(snippetData) {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(snippetData),
        })

        const result = await response.json();

        return result
    },
}