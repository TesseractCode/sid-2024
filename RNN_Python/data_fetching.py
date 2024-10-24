import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('OPENAPI_KEY')
endpoint = 'https://api.openapi.ro/api/companies/{cif}/balances'


def fetch_data(cif):
    url = endpoint.replace('{cif}', str(cif))
    headers = {
        'x-api-key': api_key
    }

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raises an exception for 4xx/5xx errors
        data = response.json()
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return []
