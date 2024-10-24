import pandas as pd # type: ignore

df = pd.read_csv("3firme_neradiate_cu_sediu_2024-07-07.csv", sep='^', usecols=[0, 1, 8], encoding='utf-8')

df.columns = ['Company Name', 'CUI', 'County']

df['CUI'] = pd.to_numeric(df['CUI'], errors='coerce')
df = df.dropna(subset=['CUI'])
df = df[df['CUI'] != 0]
df['CUI'] = df['CUI'].astype(int)

company_types = r'\b(SRL|S\.R\.L\.|SA|S\.A\.|SNC|SCS|SCA|SE|GmbH|Ltd|Inc|PLC|S R L|S A)\b'
df_filtered = df[df['Company Name'].str.contains(company_types, case=False, na=False)]

df_sorted = df_filtered.sort_values(by='CUI', ascending=True)

df_sorted.to_csv("filtered_companies_final.csv", index=False, encoding='utf-8')

total_companies = len(df)
filtered_companies = len(df_sorted)
print(f"Total companies processed: {total_companies}")
print(f"Companies kept after filtering: {filtered_companies}")
