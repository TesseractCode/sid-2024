const axios = require('axios');

async function get_chatbot_answer(query) {
    try {
        const response = await axios.post('http://localhost:5000/chatbot', {
            query: query,
        });
        
        const answer = response.data.answer;
        // console.log(answer);
        return answer;
    } catch (error) {
        console.error('Error calling Python API:', error);
        return error;
    }
}

// get_chatbot_answer('Tell me about the evolution of I.T. Perspectives S.R.L. from 2015 to today.');

module.exports = { get_chatbot_answer };
