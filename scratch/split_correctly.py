import re

with open('scratch/full_prompt_found.txt', 'r') as f:
    lines = f.readlines()

html_end_idx = -1
for i, line in enumerate(lines):
    if '</html>' in line:
        html_end_idx = i
        break

css_start_idx = -1
for i in range(html_end_idx + 1, len(lines)):
    if ':root {' in lines[i]:
        css_start_idx = i - 4 # Go back 4 lines to grab the block comment
        break

if html_end_idx != -1 and css_start_idx != -1:
    js_lines = lines[html_end_idx+1:css_start_idx]
    css_lines = lines[css_start_idx:]
    
    js_text = "".join(js_lines).strip()
    css_text = "".join(css_lines).strip()
    
    # Clean up bottom of css
    end_idx = css_text.find('this is the code please correct')
    if end_idx != -1:
        css_text = css_text[:end_idx].strip()
        
    with open('scratch/old_code/user/script.js', 'w') as f:
        f.write(js_text)
        
    with open('frontend/src/user.css', 'w') as f:
        f.write(css_text)
        
    print(f"Extracted JS lines: {len(js_lines)}")
    print(f"Extracted CSS lines: {len(css_lines)}")
else:
    print("Could not find delimiters.")
