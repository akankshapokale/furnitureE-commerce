with open('src/data/categoriesData.ts', encoding='utf-8') as f:
    text = f.read()

import re

# Find subcategories per category
cats = re.split(r'// \d+\.\s*', text)
for c in cats[1:]:
    cat_match = re.search(r'id:\s*"([^"]+)",\s*name:\s*"([^"]+)"', c)
    if not cat_match: continue
    cid, cname = cat_match.group(1), cat_match.group(2)
    print(f"\n=== CATEGORY: {cname} ({cid}) ===")
    
    sub_matches = re.findall(r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"(?:,\s*path:[^}]+)?\}', c)
    for sid, sname in sub_matches:
        # Check products in this category with subcategoryId === sid
        p_matches = re.findall(rf'id:\s*(\d+),\s*name:\s*"([^"]+)",.*?subcategoryId:\s*"{sid}"', c, re.DOTALL)
        p_info = [f"#{pid} {pname}" for pid, pname in p_matches]
        status = f"{len(p_matches)} products: {', '.join(p_info)}" if p_matches else ">>> 0 PRODUCTS! EMPTY SUB! <<<"
        print(f"  - Sub: {sname:30} (id: {sid:25}) -> {status}")
