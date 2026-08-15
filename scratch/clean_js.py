import re

with open('scratch/old_code/user/script.js', 'r') as f:
    text = f.read()

# Find the last occurrence of boot();
boot_idx = text.rfind('boot();')
if boot_idx != -1:
    # Slice the text up to boot(); plus its length
    cleaned_text = text[:boot_idx + len('boot();')]
    with open('scratch/old_code/user/script.js', 'w') as f:
        f.write(cleaned_text)
    print("Cleaned JS successfully.")
else:
    print("Could not find boot();")
