import re

with open('src/data/categoriesData.ts', encoding='utf-8') as f:
    text = f.read()

# find all subcategories defined
subcats = re.findall(r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"', text)
print(f'Total subcategory entries defined: {len(subcats)}')

# find all products
prod_pattern = re.compile(r'id:\s*(\d+),\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*subcategoryId:\s*"([^"]+)",\s*subcategoryName:\s*"([^"]+)",.*?image:\s*"([^"]+)"', re.DOTALL)
products = prod_pattern.findall(text)
print(f'Total products found: {len(products)}')
for p in products:
    print(f'[{p[2]}] Sub: {p[3]} ({p[4]}) | ID: {p[0]} | Name: {p[1]} | Img: {p[5]}')
