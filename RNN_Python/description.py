import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

tavily_api_key = os.getenv('TAVILY_API_KEY')
tavily_client = TavilyClient(tavily_api_key)


def get_description(company_name):
    query = f'Give me a short description of the company {company_name}'

    result = tavily_client.search(query, include_answer=True, max_results=5)

    answer = result['answer']

    return answer
    # return 'Not a Description!'
