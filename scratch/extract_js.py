import re

with open('scratch/full_prompt_found.txt', 'r') as f:
    text = f.read()

# HTML ends around `</html>`
html_end = text.find('</html>') + 7

# CSS starts at the comment `/* ════════════════════════════════════════════════════════`
css_start = text.find('/* ════════════════════════════════════════════════════════')

if html_end != -1 and css_start != -1:
    js_text = text[html_end:css_start].strip()
    with open('scratch/old_code/user/script.js', 'w') as out:
        out.write(js_text)
    print(f"JS Extracted. Lines: {len(js_text.splitlines())}")
else:
    print("Could not extract JS.")
