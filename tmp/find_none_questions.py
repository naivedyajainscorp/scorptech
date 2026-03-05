import re

with open(r'C:\Users\user\Documents\GitHub\scorp webfront structured\assets\data\assessment-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all checkbox questions with "None of the above" in their options
# Strategy: find each question block and check type + options
pattern = re.compile(r'id:\s*"([^"]+)".*?type:\s*"checkbox".*?options:\s*\[(.*?)\]', re.DOTALL)
matches = pattern.finditer(content)

results = []
for m in matches:
    qid = m.group(1)
    options_block = m.group(2)
    if re.search(r'none of the above', options_block, re.IGNORECASE):
        results.append(qid)

print('Checkbox questions with "None of the above":')
for r in results:
    print(r)
