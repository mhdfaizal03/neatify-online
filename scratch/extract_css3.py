import re

with open('scratch/full_prompt_found.txt', 'r') as f:
    text = f.read()

# CSS usually starts with `:root {`
# Let's find the first instance of `:root {`
root_index = text.find(':root {')
if root_index != -1:
    # Find the CSS comment block just before it
    # We can go backwards to find `/* `
    start_index = text.rfind('/*', 0, root_index)
    if start_index == -1:
        start_index = root_index
    
    css_text = text[start_index:]
    # Remove the bottom "<USER_REQUEST>" etc
    end_index = css_text.find('this is the code please correct')
    if end_index != -1:
        css_text = css_text[:end_index].strip()
        
    with open('frontend/src/user.css', 'w') as out:
        out.write(css_text)
    print(f"CSS Extracted. Bytes: {len(css_text)}")
else:
    print("Could not find CSS start.")
