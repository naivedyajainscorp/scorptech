import re

file_path = r'C:\Users\user\Documents\GitHub\scorp webfront structured\assets\data\assessment-data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Match question objects: id: "...", type: "checkbox", ... options: [ { label: "...", value: "..." } ]
# This regex is broad to capture the whole question block
question_blocks = re.findall(r'id:\s*"(.*?)",\s*.*?type:\s*"(checkbox)".*?options:\s*\[(.*?)\s*\]', content, re.DOTALL)

matches = []
for qid, qtype, options_block in question_blocks:
    if "none of the above" in options_block.lower():
        matches.append(qid)

print("Final Matching IDs:")
for m in matches:
    print(m)
