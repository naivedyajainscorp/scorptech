import re

file_path = r'C:\Users\user\Documents\GitHub\scorp webfront structured\assets\data\assessment-data.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# This is a bit more robust: find question objects by splitting on { and then looking for id, type, options
# However, a simpler approach is to find all blocks that look like questions

# Pattern for question object: { id: "...", type: "checkbox", ... options: [...] }
# We'll use a regex that captures IDs and then manually check the block for type and "None of the above"

# Find all blocks starting with { id: "..." and ending before the next { id: or end of array
question_matches = re.finditer(r'id:\s*"(.*?)",', content)

results = []

for match in question_matches:
    qid = match.group(1)
    start_pos = match.start()
    
    # Try to find the end of this object (approximate by looking for the next question id or end of section)
    # A safer way is to find the next section or the end of the file
    next_match = re.search(r'id:\s*"(.*?)",', content[match.end():])
    if next_match:
        end_pos = match.end() + next_match.start()
    else:
        end_pos = len(content)
        
    q_block = content[start_pos:end_pos]
    
    # Check if type is checkbox
    if 'type: "checkbox"' in q_block or "type: 'checkbox'" in q_block:
        # Check if "None of the above" is in the options (case-insensitive)
        if "none of the above" in q_block.lower():
            # Check if it's actually in a label or value
            if 'label: "None of the above"' in q_block or 'label: "none of the above"' in q_block.lower():
                results.append(qid)
            elif 'value: "none"' in q_block or "value: 'none'" in q_block:
                results.append(qid)

print("Identified Question IDs:")
for r in results:
    print(r)
