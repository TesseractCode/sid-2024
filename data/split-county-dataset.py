import pandas as pd
import os

df = pd.read_csv("companies_name_cif_county_dataset.csv", names=['Company Name', 'CUI', 'County'], encoding='utf-8')

df_county = df[df['County'].str.contains("Cluj", case=False, na=False)]

df_county_sorted = df_county.sort_values(by='CUI', ascending=True)

df_county_cui = df_county_sorted[['CUI']]

num_splits = 50
split_size = len(df_county_cui) // num_splits

output_dir = "cluj_cui_split"
os.makedirs(output_dir, exist_ok=True)

for i in range(num_splits):
    start_idx = i * split_size
    if i == num_splits - 1:
        subset = df_county_cui.iloc[start_idx:]
    else:
        subset = df_county_cui.iloc[start_idx:start_idx + split_size]

    subset_filename = f"{output_dir}/part_{i+1}.txt"
    subset.to_csv(subset_filename, index=False, header=False, encoding='utf-8')

print(f"County dataset split into {num_splits} files and saved in the '{output_dir}' directory.")
