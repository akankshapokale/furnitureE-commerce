import re

with open('src/data/categoriesData.ts', encoding='utf-8') as f:
    text = f.read()

# Parse categories, subcategories and their products
cats = re.split(r'// \d+\.\s*', text)
for c in cats[1:]:
    cat_name = re.search(r'name:\s*"([^"]+)"', c)
    if not cat_name: continue
    c_name = cat_name.group(1)
    print(f"\n==================== CATEGORY: {c_name} ====================")
    
    subcat_block = re.search(r'subcategories:\s*\[(.*?)\]', c, re.DOTALL)
    subcat_ids = []
    if subcat_block:
        subs = re.findall(r'\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)"', subcat_block.group(1))
        for sid, sname in subs:
            subcat_ids.append((sid, sname))
    
    prod_block = re.search(r'products:\s*\[(.*?)\]\s*,\s*\n\s*\}', c, re.DOTALL)
    prod_sub_map = {}
    if prod_block:
        prods = re.findall(r'id:\s*(\d+),\s*name:\s*"([^"]+)",.*?subcategoryId:\s*"([^"]+)",\s*subcategoryName:\s*"([^"]+)",.*?image:\s*"([^"]+)"', prod_block.group(1), re.DOTALL)
        for pid, pname, psid, psname, pimg in prods:
            if psid not in prod_sub_map:
                prod_sub_map[psid] = []
            prod_sub_map[psid].append((pid, pname, pimg))
            
    for sid, sname in subcat_ids:
        has_prods = prod_sub_map.get(sid, [])
        if has_prods:
            for pid, pname, pimg in has_prods:
                print(f"  [OK] Sub: '{sname}' (id: {sid}) -> Prod #{pid} '{pname}' | Img: {pimg[:50]}...")
        else:
            print(f"  [MISSING!] Sub: '{sname}' (id: {sid}) -> NO PRODUCTS ASSIGNED!")
