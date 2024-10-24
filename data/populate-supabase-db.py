import csv
import json

# Path to your input CSV file and output CSV files
csv_file = 'Results/Sibiu-2023.csv'  # Ensure this path is correct and the file exists
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
            writer.writerow(
                [company['cif'], company['company_name'], company['caen_code'], company['caen_description']]
            )


# Function to write indicators data to the company_indicators CSV file
def write_indicators_csv(indicators_data):
    with open(output_indicators_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(["cif", "year", "i1", "i2", "i3", "i4", "i5", "i6", "i7", "i8", "i9", "i10",
                         "i11", "i12", "i13", "i14", "i15", "i16", "i17", "i18", "i19", "i20"])
        # Write rows
        for indicator in indicators_data:
            writer.writerow([
                indicator['cif'], indicator['year'],
                indicator.get('i1', None), indicator.get('i2', None), indicator.get('i3', None),
                indicator.get('i4', None), indicator.get('i5', None), indicator.get('i6', None),
                indicator.get('i7', None), indicator.get('i8', None), indicator.get('i9', None),
                indicator.get('i10', None), indicator.get('i11', None), indicator.get('i12', None),
                indicator.get('i13', None), indicator.get('i14', None), indicator.get('i15', None),
                indicator.get('i16', None), indicator.get('i17', None), indicator.get('i18', None),
                indicator.get('i19', None), indicator.get('i20', None)
            ])


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

        # Initialize the indicator values
        indicator_values = {f"I{i}": None for i in range(1, 21)}  # Create variables I1 to I20, all set to None

        # Transform the indicators string into valid JSON
        if indicators and indicators != 'NULL':
            try:
                # Fix the format of the string to make it valid JSON
                valid_json_string = indicators.replace("'", '"')

                # Remove unnecessary outer quotes if present
                if valid_json_string.startswith('"') and valid_json_string.endswith('"'):
                    valid_json_string = valid_json_string[1:-1]

                # Parse the JSON
                indicators_list = json.loads(valid_json_string)

                # Extract val_indicator from indicators list and categorize them
                for d in indicators_list:
                    if 'indicator' in d and 'val_indicator' in d:
                        indicator_num = int(d['indicator'][1:])  # Get the indicator number
                        indicator_values[f"I{indicator_num}"] = d[
                            'val_indicator']  # Set the value for the corresponding indicator
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                print(f"Error parsing indicators for CIF {cif}: {e}")

        # Append indicator data with year defaulted to 2023
        indicators_data.append({
            "cif": cif,
            "year": 2023,  # Default to 2023
            **indicator_values  # Expand the dictionary to include all iN values
        })

# Write the results to CSVs
write_companies_csv(companies_data)
write_indicators_csv(indicators_data)

print("Data written to CSVs successfully.")
