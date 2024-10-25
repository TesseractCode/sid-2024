from tools import call_tools, tool_descriptions
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

open_ai_client = OpenAI()
open_ai_model = 'gpt-4o'


def choose_tools(query):
    completion = open_ai_client.chat.completions.create(
        model=open_ai_model,
        messages=[
            {
                'role': "system",
                'content': "You are a smart assistant that helps with choosing a set of tools "
                           "that will be used for making progress towards answering the user's query. "
                           f"This is the description of the tools available: {tool_descriptions}\n\n"
                           "You will format your answer as a dictionary where the keys are the tool names "
                           "and the values are the input data for that tool. Make sure you respect the indications "
                           "for formating the input data for the tools. You mustn't answer the user's question. "
                           "Just answer with the tool calls that need to be done. If the question can be answered "
                           "without tool information you answer with an empty dictionary.",
            },
            {
                'role': "user",
                'content': query,
            },
        ]
    )

    answer = completion.choices[0].message.content

    # print(answer)

    start = answer.find("{")
    # print(start)
    end = len(answer) - 4
    # print(end)

    json_answer = answer[start:end]

    # print(json_answer)
    return json_answer


def answer_query(query):
    tools_chosen = choose_tools(query)
    print(tools_chosen)

    tool_results = call_tools(tools_chosen)
    # print(tool_results)

    completion = open_ai_client.chat.completions.create(
        model=open_ai_model,
        messages=[
            {
                'role': "system",
                'content': "You are a smart assistant that uses tool results to answer the user's questions.\n"
                           f"Here are the tool results:\n {tool_results}",
            },
            {
                'role': "user",
                'content': query,
            },
        ]
    )

    answer = completion.choices[0].message.content

    return answer


query_1 = 'Give me a short description of the company I.T. Perspectives S.R.L. and tell me their official website'
query_2 = ('Give me a prediction for the net profit of I.T. Perspectives S.R.L. on the year 2024. '
           'Explain your reasoning.')
query_3 = 'Tell me about the evolution of I.T. Perspectives S.R.L. from 2015 to today.'
# print(answer_query(query_3))
