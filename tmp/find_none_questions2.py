import re

with open(r'C:\Users\user\Documents\GitHub\scorp webfront structured\assets\data\assessment-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Split into question blocks by finding id: "..." patterns
# More robust: find each question object via its id field, then check type and options text
question_blocks = re.split(r'(?=\{\s*\r?\n\s*id:\s*")', content)

results = []
for block in question_blocks:
    id_match = re.search(r'id:\s*"([^"]+)"', block)
    if not id_match:
        continue
    qid = id_match.group(1)
    
    # Check if this block has type: "checkbox"
    type_match = re.search(r'type:\s*"([^"]+)"', block)
    if not type_match or type_match.group(1) != 'checkbox':
        continue
    
    # Check if "None of the above" appears in the block
    if re.search(r'none of the above', block, re.IGNORECASE):
        results.append(qid)
        print(f"Found: {qid}")

print(f"\nTotal: {len(results)} questions")
print("IDs:", results)
