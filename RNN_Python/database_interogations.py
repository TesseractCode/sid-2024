import requests
import json


def get_company_name_by_cif(cif):
    url = f'http://localhost:3000/public/company/{cif}/preview-indicators'
    response = requests.get(url)
    text = response.text
    dictionary = json.loads(text)
    return dictionary['company']['company_name']


def get_company_cif_by_name(name):
    url = f'http://localhost:3000/public/local-search?query={name}'
    response = requests.get(url)
    text = response.text
    dictionary = json.loads(text)
    return dictionary['companies'][0]['cif']
