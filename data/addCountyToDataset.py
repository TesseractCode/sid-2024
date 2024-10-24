import csv

# Path to your input CSV file and output CSV file
input_csv_file = 'FinalDatasets/companiesDataset/sibiu-companies.csv'  # Input file
output_csv_file = 'updated_companies.csv'  # Output file


# Function to read the input CSV, add the county column, and write to output CSV
def add_county_column(input_file, output_file):
    with open(input_file, mode='r', newline='', encoding='utf-8') as infile:
        reader = csv.DictReader(infile)

        # Create a new list to hold updated rows
        updated_rows = []

        for row in reader:
            # Add a new key-value pair for the county
            row['county'] = 'Sibiu'
            updated_rows.append(row)

    # Get the fieldnames for the output CSV
    fieldnames = reader.fieldnames + ['county']  # Include the new county column

    # Write the updated data to the output CSV
    with open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
        writer = csv.DictWriter(outfile, fieldnames=fieldnames)
        writer.writeheader()  # Write the header row
        writer.writerows(updated_rows)  # Write the data rows

    print(f"Updated CSV file created: {output_file}")


# Run the function to add the county column
add_county_column(input_csv_file, output_csv_file)
