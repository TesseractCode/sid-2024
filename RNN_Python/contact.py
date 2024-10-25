from openai import OpenAI
import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

tavily_api_key = os.getenv('TAVILY_API_KEY')
tavily_client = TavilyClient(tavily_api_key)
open_ai_client = OpenAI()
open_ai_model = 'gpt-4o'


def get_contacts(company_name):
    query = f'Give me the phone number, email, location and official website for the company {company_name}'

    result = tavily_client.search(query, include_answer=True, max_results=5)

    answer = result['answer']

    return answer


def get_contacts_in_json(company_name):
    contacts = get_contacts(company_name)

    completion = open_ai_client.chat.completions.create(
        model=open_ai_model,
        messages=[
            {
                'role': "system",
                'content': "You are a smart jsonifyer for contact information. From the user input extract the phone "
                           "number, the email, the location and the official website. Your answer has to be a json "
                           "formated dictionary with the following keys: ['phone_number', 'email', 'location', "
                           "'website']. If there is missing information for a certain key, make it's value the empty "
                           "string.",
            },
            {
                'role': "user",
                'content': contacts,
            },
        ]
    )

    answer = completion.choices[0].message.content

    start = answer.find("{")
    end = answer.find("}")

    json_answer = answer[start:end] + "}"

    # print("-_-" + answer + "-_-")
    # print("-_-" + rest + "-_-")

    return json_answer


# print(get_contacts_in_json("I.T. Perspectives S.R.L."))
# print(get_contacts_in_json("VISMA"))
