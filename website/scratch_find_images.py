import re, os

all_images = []
for root, dirs, files in os.walk('src'):
    for file in files:
        if file.endswith(('.ts', '.tsx')):
            p = os.path.join(root, file)
            with open(p, encoding='utf-8') as f:
                content = f.read()
                imgs = re.findall(r'https://images\.unsplash\.com/[^\s"\'`]+', content)
                for img in imgs:
                    all_images.append((p, img))

print(f"Total unsplash images across src: {len(all_images)}")
seen = set()
for p, img in all_images:
    clean = img.split('?')[0]
    if clean not in seen:
        seen.add(clean)
        print(f"{clean} (found in {os.path.basename(p)})")
