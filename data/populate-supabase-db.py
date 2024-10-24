import csv
import json

# Path to your input CSV file and output CSV files
csv_file = 'Results/Sibiu-2023.csv'
output_companies_file = 'companies_output.csv'
output_indicators_file = 'company_indicators_output.csv'

# Function to write companies data to the companies CSV file
def write_companies_csv(companies_data):
    with open(output_companies_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(["cif", "company_name", "caen_code", "caen_description"])
        # Write rows
        for company in companies_data:
            writer.writerow([company['cif'], company['company_name'], company['caen_code'], company['caen_description']])

# Function to write indicators data to the company_indicators CSV file
def write_indicators_csv(indicators_data):
    with open(output_indicators_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(["cif", "year", "i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10",
                         "i11", "i12", "i13", "i14", "i15", "i16", "i17", "i18", "i19", "i20"])
        # Write rows
        for indicator in indicators_data:
            writer.writerow([indicator['cif'], indicator['year'], indicator['i1'], indicator['i2'], indicator['i3'],
                             indicator['i4'], indicator['i5'], indicator['i6'], indicator['i7'], indicator['i8'],
                             indicator['i9'], indicator['i10'], indicator['i11'], indicator['i12'], indicator['i13'],
                             indicator['i14'], indicator['i15'], indicator['i16'], indicator['i17'], indicator['i18'],
                             indicator['i19'], indicator['i20']])

# Read the CSV file, sort by CIF, and process
companies_data = []
indicators_data = []

with open(csv_file, newline='', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)

    # Convert to list and sort by 'CIF'
    data = sorted(reader, key=lambda row: int(float(row['CUI'])))  # Ensure CIF is treated as an integer for sorting

    for row in data:
        cif = row['CUI']
        company_name = row['Company Name']
        caen_code = row['CAEN']
        caen_description = row['CAEN Description']
        indicators = row['Indicators']

        # Skip rows with missing or invalid CIF or relevant data
        if not cif or not company_name or not caen_code or not caen_description:
            continue

        # Append company data
        companies_data.append({
            "cif": cif,
            "company_name": company_name,
            "caen_code": caen_code,
            "caen_description": caen_description
        })

        # Parse the indicators using json.loads() instead of eval()
        try:
            # Check if indicators are present and replace 'NULL' with 'null' for JSON parsing
            if indicators and indicators != 'NULL':
                indicators_list = json.loads(indicators.replace('NULL', 'null'))

                # Ensure that indicators_list is valid and a list of dictionaries
                if isinstance(indicators_list, list) and indicators_list:
                    # Extract val_indicator from indicators list, assigning None where not found
                    indicator_values = {f"I{d['indicator'][1:]}": d['val_indicator'] for d in indicators_list if 'indicator' in d and 'val_indicator' in d}
                else:
                    # If no indicators found, set them to None
                    indicator_values = {f"I{i}": None for i in range(1, 21)}
            else:
                # If indicators are not present, set all to None
                indicator_values = {f"I{i}": None for i in range(1, 21)}
        except (json.JSONDecodeError, KeyError, TypeError):
            # If there's any error in parsing, set all to None
            indicator_values = {f"I{i}": None for i in range(1, 21)}

        # Append indicator data with year defaulted to 2023
        indicators_data.append({
            "cif": cif,
            "year": 2023,  # Default to 2023
            "i1": indicator_values.get('I1'),
            "i2": indicator_values.get('I2'),
            "i3": indicator_values.get('I3'),
            "i4": indicator_values.get('I4'),
            "i5": indicator_values.get('I5'),
            "i6": indicator_values.get('I6'),
            "i7": indicator_values.get('I7'),
            "i8": indicator_values.get('I8'),
            "i9": indicator_values.get('I9'),
            "i10": indicator_values.get('I10'),
            "i11": indicator_values.get('I11'),
            "i12": indicator_values.get('I12'),
            "i13": indicator_values.get('I13'),
            "i14": indicator_values.get('I14'),
            "i15": indicator_values.get('I15'),
            "i16": indicator_values.get('I16'),
            "i17": indicator_values.get('I17'),
            "i18": indicator_values.get('I18'),
            "i19": indicator_values.get('I19'),
            "i20": indicator_values.get('I20')
        })

# Write the results to CSVs
write_companies_csv(companies_data)
write_indicators_csv(indicators_data)

print("Data written to CSVs successfully.")
