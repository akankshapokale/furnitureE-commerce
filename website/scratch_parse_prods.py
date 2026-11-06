import re

with open('src/data/categoriesData.ts', encoding='utf-8') as f:
    text = f.read()

# Let's inspect each product in products: [...]
prod_blocks = re.findall(r'(\{\s*id:\s*\d+,.*?description:.*?\n\s*\})', text, re.DOTALL)
print(f"Total product blocks matched: {len(prod_blocks)}")

for p in prod_blocks:
    pid = re.search(r'id:\s*(\d+)', p)
    name = re.search(r'name:\s*"([^"]+)"', p)
    cat = re.search(r'category:\s*"([^"]+)"', p)
    subId = re.search(r'subcategoryId:\s*"([^"]+)"', p)
    subName = re.search(r'subcategoryName:\s*"([^"]+)"', p)
    img = re.search(r'image:\s*"([^"]+)"', p)
    
    pid_s = pid.group(1) if pid else '?'
    name_s = name.group(1) if name else '?'
    cat_s = cat.group(1) if cat else '?'
    subId_s = subId.group(1) if subId else '?'
    subName_s = subName.group(1) if subName else '?'
    img_s = img.group(1) if img else '?'
    
    print(f"Cat: {cat_s:20} | Sub: {subId_s:22} ({subName_s:22}) | #{pid_s:4} {name_s[:35]:35} | Img: {img_s}")
