import re

with open('scratch/full_prompt_found.txt', 'r') as f:
    text = f.read()

# Find the end of JS / start of CSS
css_start = text.find('/* ════════════════════════════════════════════════════════')

if css_start != -1:
    css_text = text[css_start:]
    # Remove the bottom "<USER_REQUEST>" etc that is appended by the prompt
    end_index = css_text.find('this is the code please correct')
    if end_index != -1:
        css_text = css_text[:end_index].strip()
        
    with open('frontend/src/user.css', 'w') as out:
        out.write(css_text)
    print(f"CSS Extracted. Bytes: {len(css_text)}")
else:
    print("Could not find CSS start.")
