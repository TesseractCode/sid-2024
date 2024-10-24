from flask import Flask, request, jsonify
from ai_prediction import run
from contact import get_contacts_in_json

app = Flask(__name__)


@app.route('/ai_prediction', methods=['POST'])
def get_ai_prediction():
    data = request.get_json()  # Get the JSON payload from the request
    company_name = data.get('company_name')
    cif = data.get('cif')

    prediction = run(company_name, cif)

    return jsonify({'ai_prediction': prediction})


@app.route('/contact', methods=['POST'])
def get_contact():
    data = request.get_json()  # Get the JSON payload from the request
    company_name = data.get('company_name')

    contact = get_contacts_in_json(company_name)

    return contact


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)