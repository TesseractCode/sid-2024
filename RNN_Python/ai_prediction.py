from openai import OpenAI
import os
from dotenv import load_dotenv
from tavily import TavilyClient
from data_fetching import fetch_data
from data_isolation import isolate_data_on_years

load_dotenv()

tavily_api_key = os.getenv('TAVILY_API_KEY')
tavily_client = TavilyClient(tavily_api_key)
open_ai_client = OpenAI()
open_ai_model = 'gpt-4o'


def tavily_query_generation(caen_set, year):
    completion = open_ai_client.chat.completions.create(
        model=open_ai_model,
        messages=[
            {
                'role': "system",
                'content': "You are a smart assistant that helps with generating queries for Tavily AI to answer. "
                           "When the user gives you a list of CAEN codes and a year "
                           "you generate a question that when answered by Tavily AI will help determine "
                           "a prediction of the success for that year of companies in that CAEN category. "
                           "Make the question focus on the difficulties of the industry.",
            },
            {
                'role': "user",
                'content': f"CAEN : {caen_set}\nyear : {year}",
            },
        ]
    )

    answer = completion.choices[0].message.content
    # print(answer)
    return answer


def tavily_interogation(query):
    result = tavily_client.search(query, include_answer=True)
    # print(result)
    answer = result['answer']
    # print(answer)
    return answer


def predict_values_for_next_year(company_name, last_years_data, tavily_prediction_query, tavily_domain_prediction):
    completion = open_ai_client.chat.completions.create(
        model=open_ai_model,
        messages=[
            {
                'role': "system",
                'content': "You are a smart assistant with great atention to detail. "
                           "When the user gives you a company's name and some of the company's data from "
                           "the last few years "
                           "you will make a prediction of the company's data for the next year. "
                           "The user will also give you information about a question they asked Tavily AI about the "
                           "Business area that the company is in and about the answer they received. "
                           "Take the Tavily AI prediction into consideration when making your prediction. "
                           "Don't fall in the trap of wishfull thinking; make predictions based on facts.",
            },
            {
                'role': "user",
                'content': f"company name :\n{company_name}\n\n\n"
                           f"data for previous years :\n{last_years_data}\n\n\n"
                           f"tavily query :\n{tavily_prediction_query}\n\n\n"
                           f"tavily prediction :\n{tavily_domain_prediction}",
            },
        ]
    )

    answer = completion.choices[0].message.content
    # print(answer)
    return answer


def company_prediction(company_name, company_history, caen_set, year):
    separator = '-_' * 50
    # print(separator)

    query = ("What are the key market trends and technological advancements expected in the software publishing "
             "industry (CAEN code 6201) for the year 2024, and how are they likely to impact the success and growth "
             "of companies operating in this sector?")
    query = tavily_query_generation(caen_set, year)
    # print(query)
    # print(separator)

    prediction = ("The software publishing industry in 2024 is expected to see key trends and technological "
                  "advancements such as the increased utilization of AI, data analytics, and emerging technologies to "
                  "drive innovation and enhance recurring revenue streams. Cloud computing, artificial intelligence ("
                  "AI), and cybersecurity are likely to play crucial roles in the industry's growth and innovation "
                  "efforts. Companies focusing on enterprise spending on software and IT services are expected to "
                  "leverage these technologies to drive success and competitiveness in the market. Additionally, "
                  "the industry is likely to see a greater emphasis on sustainability reporting, particularly in data "
                  "centers, reflecting a growing awareness of environmental concerns and the need for responsible "
                  "business practices. The presence of Chief Data Officers (CDOs) in leading companies is also "
                  "expected to continue, with a positive impact on revenue growth, indicating the increasing "
                  "importance of data and analytics in driving business decisions and strategies.")
    prediction = tavily_interogation(query)
    # print(prediction)
    # print(separator)

    financial_prediction = predict_values_for_next_year(company_name, company_history, query, prediction)
    # print(financial_prediction)
    # print(separator)
    return financial_prediction


def make_prediction(company_name, cif, features=None):
    if features is None:
        features = ['cifra_de_afaceri_neta', 'profit_net', 'numar_mediu_de_salariati']

    raw_api_data = fetch_data(cif)

    company_history, caen_set, year = isolate_data_on_years(raw_api_data, features)

    # print(company_history)

    prediction = company_prediction(company_name, company_history, caen_set, year)

    # with open("answer.txt", "w", encoding="utf-8") as answer_file:
    #     answer_file.write(prediction)

    return prediction


# run('La Doi Pasi', 15600976)
# run('I.T. Perspectives S.R.L.', 16341004)
