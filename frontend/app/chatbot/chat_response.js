async function getAnswer(query) {
    const url = 'http://localhost:3000/public/answer';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); 
        return data.answer; 
    } catch (error) {
        console.error('Error fetching the answer:', error);
        throw error; 
    }
}

module.exports = { getAnswer };
