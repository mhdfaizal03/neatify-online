import json

found = False
with open('/Users/abhijith/.gemini/antigravity-ide/brain/b8c67dbf-4ede-46b0-84c3-530c2fd55522/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        if data.get('type') == 'USER_INPUT':
            content = data.get('content', '')
            if 'style.css?v=48' in content and '/* ══════════════════════════════════════════════════════════' in content:
                with open('scratch/full_prompt_found.txt', 'w') as out:
                    out.write(content)
                found = True
                print("Found!")
                break
if not found:
    print("Not found in any USER_INPUT")
