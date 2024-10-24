import json
import requests
import csv
import time
from concurrent.futures import ThreadPoolExecutor
import os

def load_proxies_from_json(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
        proxies = []
        for ip, details in data.items():
            if details['type'].lower() == 'http':
                proxy_type = details['type'].lower()
                proxy = {proxy_type: f"{proxy_type}://{ip}:{details['port']}"}
                proxies.append(proxy)
        return proxies

def load_cuis_from_file(file_path):
    with open(file_path, 'r') as file:
        return [line.strip() for line in file.readlines()]

def make_request(cuis, proxy, csv_writer):
    for cui in cuis:
        url = f"https://webservicesp.anaf.ro/bilant?an=2023&cui={cui}"
        try:
            response = requests.get(url, proxies=proxy, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data['deni'] and data['i']:
                    csv_writer.writerow([data['cui'], data['deni'], data['caen'], data['den_caen'], data['i']])
                    print(f"Valid data saved for CUI: {cui}")
                else:
                    csv_writer.writerow([cui, "NULL", "NULL", "NULL", "NULL"])
                    print(f"Invalid data for CUI: {cui}")
            else:
                print(f"Failed request for CUI: {cui} with status code {response.status_code}")
        except Exception as e:
            print(f"Request failed for CUI: {cui} using {proxy}: {e}")
        time.sleep(1.2)

# Main function
def main():
    proxies = load_proxies_from_json('proxies.json')
    cui_files = [f'part_{i}.txt' for i in range(1, 11)]

    with open('results.csv', mode='w', newline='', encoding='utf-8') as file:
        csv_writer = csv.writer(file)
        csv_writer.writerow(['CUI', 'Company Name', 'CAEN', 'CAEN Description', 'Indicators'])  # CSV headers


        with ThreadPoolExecutor(max_workers=min(50, len(proxies))) as executor:
            for i, proxy in enumerate(proxies):
                if i < len(cui_files):
                    cuis = load_cuis_from_file(cui_files[i])
                    executor.submit(make_request, cuis, proxy, csv_writer)

if __name__ == "__main__":
    main()