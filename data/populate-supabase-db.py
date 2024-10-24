import csv
import json

# Path to your input CSV file and output CSV files
csv_file = 'Results/results_Sibiu_2023.csv'  # Ensure this path is correct and the file exists
output_companies_file = 'FinalDatasets/companiesDataset/sibiu-companies.csv'
output_indicators_file = 'FinalDatasets/Sibiu/sibiu-indicators-2023.csv'
output_invalid_names_file = 'FinalDatasets/invalidNames/sibiu-invalid-names.csv'  # New file for invalid names


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


# Function to write invalid company names to a CSV file
def write_invalid_names(invalid_names_data):
    with open(output_invalid_names_file, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        # Write header
        writer.writerow(["cif"])
        # Write rows
        for cif in invalid_names_data:
            writer.writerow([cif])


# Read the CSV file, sort by CIF, and process
companies_data = []
indicators_data = []
invalid_names_data = []  # List to hold CIFs of companies with invalid names

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

        # Skip rows with missing or invalid CIF, relevant data, or null company name
        if not cif or not company_name or not caen_code or not caen_description or company_name == 'NULL':
            if company_name == 'NULL':  # If company name is null, store CIF
                invalid_names_data.append(cif)
            continue

        # Append company data
        companies_data.append({
            "cif": cif,
            "company_name": company_name,
            "caen_code": caen_code,
            "caen_description": caen_description
        })

        # Initialize local variables for indicators
        I1 = I2 = I3 = I4 = I5 = I6 = I7 = I8 = I9 = I10 = I11 = I12 = I13 = I14 = I15 = I16 = I17 = I18 = I19 = I20 = None

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

                # Extract val_indicator from indicators list and assign to local variables
                for d in indicators_list:
                    if 'indicator' in d and 'val_indicator' in d:
                        # Get the indicator number (e.g., "I20" -> 20)
                        indicator_num = int(d['indicator'][1:])  # Extract number from "I20"
                        value = d['val_indicator']
                        # Assign the value to the corresponding variable based on the indicator number
                        if indicator_num == 1:
                            I1 = value
                        elif indicator_num == 2:
                            I2 = value
                        elif indicator_num == 3:
                            I3 = value
                        elif indicator_num == 4:
                            I4 = value
                        elif indicator_num == 5:
                            I5 = value
                        elif indicator_num == 6:
                            I6 = value
                        elif indicator_num == 7:
                            I7 = value
                        elif indicator_num == 8:
                            I8 = value
                        elif indicator_num == 9:
                            I9 = value
                        elif indicator_num == 10:
                            I10 = value
                        elif indicator_num == 11:
                            I11 = value
                        elif indicator_num == 12:
                            I12 = value
                        elif indicator_num == 13:
                            I13 = value
                        elif indicator_num == 14:
                            I14 = value
                        elif indicator_num == 15:
                            I15 = value
                        elif indicator_num == 16:
                            I16 = value
                        elif indicator_num == 17:
                            I17 = value
                        elif indicator_num == 18:
                            I18 = value
                        elif indicator_num == 19:
                            I19 = value
                        elif indicator_num == 20:
                            I20 = value
            except (json.JSONDecodeError, KeyError, TypeError) as e:
                print(f"Error parsing indicators for CIF {cif}: {e}")

        # Append indicator data with year defaulted to 2023
        indicators_data.append({
            "cif": cif,
            "year": 2023,  # Default to 2023
            "i1": I1,
            "i2": I2,
            "i3": I3,
            "i4": I4,
            "i5": I5,
            "i6": I6,
            "i7": I7,
            "i8": I8,
            "i9": I9,
            "i10": I10,
            "i11": I11,
            "i12": I12,
            "i13": I13,
            "i14": I14,
            "i15": I15,
            "i16": I16,
            "i17": I17,
            "i18": I18,
            "i19": I19,
            "i20": I20
        })

# Write the results to CSVs
write_companies_csv(companies_data)
write_indicators_csv(indicators_data)
write_invalid_names(invalid_names_data)  # Write invalid names to the new CSV file

print("Data written to CSVs successfully.")
