with open('src/data/categoriesData.ts', encoding='utf-8') as f:
    lines = f.readlines()

for i in range(620, 792):
    print(f"{i+1}: {lines[i]}", end="")
