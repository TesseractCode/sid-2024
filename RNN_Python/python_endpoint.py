from flask import Flask, request, jsonify
from ai_prediction import make_prediction
from contact import get_contacts_in_json
from description import get_description
from chatbot import answer_query

app = Flask(__name__)


@app.route('/ai_prediction', methods=['POST'])
def ai_prediction_endpoint():
    data = request.get_json()  # Get the JSON payload from the request
    company_name = data.get('company_name')
    cif = data.get('cif')

    prediction = make_prediction(company_name, cif)

    return jsonify({'ai_prediction': prediction})


@app.route('/contact', methods=['POST'])
def contact_endpoint():
    data = request.get_json()  # Get the JSON payload from the request
    company_name = data.get('company_name')

    contact = get_contacts_in_json(company_name)

    return contact


@app.route('/chatbot', methods=['POST'])
def chatbot_endpoint():
    data = request.get_json()  # Get the JSON payload from the request
    query = data.get('query')

    answer = answer_query(query)

    return jsonify({'answer': answer})


@app.route('/description', methods=['POST'])
def description_endpoint():
    data = request.get_json()  # Get the JSON payload from the request
    company_name = data.get('company_name')

    description = get_description(company_name)

    return jsonify({'description': description})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
