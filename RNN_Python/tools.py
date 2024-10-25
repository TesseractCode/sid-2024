from database_interogations import get_company_cif_by_name, get_company_name_by_cif
from data_fetching import fetch_data
from data_isolation import isolate_data_on_years
from contact import get_contacts_in_json
from description import get_description
from ai_prediction import make_prediction
import json


complete_list_of_features = [
    'active_circulante_total',
    'active_imobilizate_total',
    'capitaluri_total',
    'casa_si_conturi',
    'cheltuieli_in_avans',
    'cheltuieli_totale',
    'cifra_de_afaceri_neta',
    'creante',
    'datorii_total',
    'numar_mediu_de_salariati',
    'profit_brut',
    'profit_net',
    'venituri_totale'
]

company_data_fetcher = {'name': 'company_data_fetcher_cif',
                        'description': 'fetches a set of features for a company in a range of years. '
                                       'Either "cif" or "name" values from the input can be omited. '
                                       'Don\'t use null values for the omited key, just don\'t mention it at all.',
                        'input_format': '{ "cif" : cif_value, "name" : name, "features" : list_of_features, '
                                        '"start_year" : start_year, "end_year" : end_year }',
                        'input_constraints': 'list_of_features can only contain features from this list: '
                                             f'{complete_list_of_features} and must not be the empty list '
                                             'and the start_year and end_year are both included in the range '
                                             'and they can be falues from 2010 to 2023',
                        'output_format': 'a json formated list of dictionaries where the keys for the '
                                         'dictionaries are the feature names from the list_of_features '
                                         'and the values are the coresponding values for the year that '
                                         'dictionary is representing.',
                        'output_constraints': "Example:\n"
                                              "[{'year': 2021, 'cifra_de_afaceri_neta': 17512292, "
                                              "'numar_mediu_de_salariati': 67, 'profit_brut': 7450696, "
                                              "'profit_net': 6468599}, {'year': 2022, 'cifra_de_afaceri_neta': "
                                              "24127569, 'numar_mediu_de_salariati': 87, 'profit_brut': 8885409, "
                                              "'profit_net': 7694523}]"}

company_contact_fetcher = {'name': 'company_contact_fetcher',
                           'description': 'fetches some contact information about a company. '
                                          'Either "cif" or "name" values from the input can be omited. '
                                          'Don\'t use null values for the omited key, just don\'t mention it at all.',
                           'input_format': '{ "cif" : cif_value, "name" : name }',
                           'input_constraints': '',
                           'output_format': ' { "phone_number" : phone_number, "email" : email, '
                                            '"location" : location, "website" : website }',
                           'output_constraints': 'Values that are not found will be the empty string.'}

company_description_generator = {'name': 'company_description_generator',
                                 'description': 'generates a description for a company'
                                                'Either "cif" or "name" values from the input can be omited. '
                                                'Don\'t use null values for the omited key, '
                                                'just don\'t mention it at all.',
                                 'input_format': '{ "cif" : cif_value, "name" : name }',
                                 'input_constraints': '',
                                 'output_format': 'description',
                                 'output_constraints': 'description is a string containing the description'}

company_future_prospects_generator = {'name': 'company_future_prospects_generator',
                                      'description': 'generates a prediction related to it\'s performance in the '
                                                     'upcoming years. '
                                                     'Either "cif" or "name" values from the input can be omited. '
                                                     'Don\'t use null values for the omited key, '
                                                     'just don\'t mention it at all.',
                                      'input_format': '{ "cif" : cif_value, "name" : name, '
                                                      '"features" : list_of_features }',
                                      'input_constraints': 'list_of_features can only contain features from this list: '
                                                           f'{complete_list_of_features} '
                                                           f'and must not be the empty list',
                                      'output_format': 'prospect',
                                      'output_constraints': 'prospect is a string containing the prediction'}

company_cif_by_name = {'name': 'company_cif_by_name',
                               'description': 'returns the cif of a company by knowing it\'s name',
                               'input_format': 'name',
                               'input_constraints': 'name is a string',
                               'output_format': 'cif',
                               'output_constraints': 'cif is a number'}

company_name_by_cif = {'name': 'company_name_by_cif',
                               'description': 'returns the name of a company by knowing it\'s cif',
                               'input_format': 'cif',
                               'input_constraints': 'cif is a number',
                               'output_format': 'name',
                               'output_constraints': 'name is a string'}

tool_descriptions = [
    company_data_fetcher,
    company_contact_fetcher,
    company_description_generator,
    company_future_prospects_generator,
    company_cif_by_name,
    company_name_by_cif
]


def company_data_fetcher_tool(input_data):
    dictionary = input_data if input_data is dict else json.loads(input_data)
    cif = dictionary.get('cif')
    name = dictionary.get('name')
    features = dictionary.get('features')
    start_year = dictionary.get('start_year')
    end_year = dictionary.get('end_year')

    if cif is None:
        cif = get_company_cif_by_name(name)

    fetched_data = fetch_data(cif)
    isolated_data, _, _ = isolate_data_on_years(fetched_data, features)

    selected_data = []
    for year_data in isolated_data:
        if start_year <= year_data['year'] <= end_year:
            selected_data.append(year_data)

    output = f'{selected_data}'

    return output


def company_contact_fetcher_tool(input_data):
    dictionary = input_data if input_data is dict else json.loads(input_data)
    cif = dictionary.get('cif')
    name = dictionary.get('name')

    if name is None:
        name = get_company_name_by_cif(cif)

    return get_contacts_in_json(name)


def company_description_generator_tool(input_data):
    dictionary = input_data if input_data is dict else json.loads(input_data)
    cif = dictionary.get('cif')
    name = dictionary.get('name')

    if name is None:
        name = get_company_name_by_cif(cif)

    return get_description(name)


def company_future_prospects_generator_tool(input_data):
    dictionary = input_data if input_data is dict else json.loads(input_data)
    cif = dictionary.get('cif')
    name = dictionary.get('name')
    features = dictionary.get('features')

    if cif is None:
        cif = get_company_cif_by_name(name)

    if name is None:
        name = get_company_name_by_cif(cif)

    return make_prediction(name, cif, features)


def company_cif_by_name_tool(input_data):
    return get_company_cif_by_name(input_data)


def company_name_by_cif_tool(input_data):
    return get_company_name_by_cif(input_data)


tools = {
    company_data_fetcher['name']: company_data_fetcher_tool,
    company_contact_fetcher['name']: company_contact_fetcher_tool,
    company_description_generator['name']: company_description_generator_tool,
    company_future_prospects_generator['name']: company_future_prospects_generator_tool,
    company_cif_by_name['name']: company_cif_by_name_tool,
    company_name_by_cif['name']: company_name_by_cif_tool
}


def call_tools(tools_to_call):
    tool_results = {}

    dictionary = json.loads(tools_to_call)
    for tool_name, tool_input in dictionary.items():
        tool_input = f'{tool_input}'.replace("'", '"')
        tool = tools[tool_name]
        print(f'Tool {tool_name} has been called with input value: {tool_input}')
        tool_result = tool(tool_input)
        print(f'Tool {tool_name} has returned with output value: {tool_result}')
        tool_results[tool_name] = tool_result

    result = f'{tool_results}'

    return result
