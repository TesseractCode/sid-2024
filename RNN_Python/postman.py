import requests

# Define the URL
url = 'http://localhost:3000/public/answer'

# Define the payload (body)
payload = {
    "company_name": "I.T. Perspectives S.R.L.",
    "cif": 15600976
}

payload = {
    "query": "Tell me about the evolution of I.T. Perspectives S.R.L. from 2015 to today."
}

# Define the Bearer token
token = ('eyJhbGciOiJIUzI1NiIsImtpZCI6ImU0UlNiWWFTME9RS09jdVkiLCJ0eXAiOiJKV1QifQ'
         '.eyJpc3MiOiJodHRwczovL2F2b2JhZmd6dG1tamRza2NhbnJuLnN1cGFiYXNlLmNvL2F1d'
         'GgvdjEiLCJzdWIiOiJmYTYwOGFkZC1lOGMwLTQ3NGEtOTQwMS1mNDgyZWM5MjAwMWIiLCJ'
         'hdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzI5ODI1OTYwLCJpYXQiOjE3Mjk4MjIzN'
         'jAsImVtYWlsIjoibWloYWkuc2Vjb3NhbkBzdHVkLnViYmNsdWoucm8iLCJwaG9uZSI6IiI'
         'sImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtY'
         'WlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoibWloYWkuc2Vjb3NhbkBzdHVkLnV'
         'iYmNsdWoucm8iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInBob25lX3ZlcmlmaWVkIjpmY'
         'WxzZSwic3ViIjoiZmE2MDhhZGQtZThjMC00NzRhLTk0MDEtZjQ4MmVjOTIwMDFiIn0sInJ'
         'vbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoic'
         'GFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3Mjk4MjIzNjB9XSwic2Vzc2lvbl9pZCI6Ijc0MjR'
         'hZGNiLWJkODktNDRiMi04YzdlLTFhMzBmOGM5OWUyMCIsImlzX2Fub255bW91cyI6ZmFsc'
         '2V9.1N2IBJhi1dNTeWDQNy48CUZLmWZ3Cum91GRyXaYMqZo')

# Define the headers, including the Authorization header with the Bearer token
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'  # Ensuring the content type is JSON
}

# Make the POST request
response = requests.post(url, json=payload, headers=headers)

# Print the response from the server
print(f"Status Code: {response.status_code}")
print(f"Response Body: {response.text}")
