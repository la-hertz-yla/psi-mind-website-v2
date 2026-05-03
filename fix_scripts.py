import os
import re

files = [
    'src/HTML/cours_math.html',
    'src/HTML/cours_physique.html',
    'src/HTML/cours_si.html',
    'src/HTML/cours-chimie.html',
    'src/HTML/pratique_info.html',
    'src/HTML/pratique_math.html',
    'src/HTML/pratique_physique.html',
    'src/HTML/pratique_si.html',
    'src/HTML/pratique.chimie.html',
    'src/HTML/resume_chimie.html',
    'src/HTML/resume_info.html',
    'src/HTML/resume_math.html',
    'src/HTML/resume_physique.html',
    'src/HTML/resume_si.html'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the script block
    old_scripts = re.search(r'(\s*)<script src="\.\./js/index3-1\.js"></script>\s*<script src="https://cdn\.jsdelivr\.net/npm/@supabase/supabase-js"></script>\s*<script src="\.\./js/supabase\.js"></script>\s*<script src="\.\./js/auth\.js"></script>', content, re.DOTALL)
    
    if old_scripts:
        indent = old_scripts.group(1)
        new_scripts = f'{indent}<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>\n{indent}<script src="../js/supabase.js"></script>\n{indent}<script src="../js/auth.js"></script>\n{indent}<script src="../js/favorites.js"></script>\n{indent}<script src="../js/index3-1.js"></script>'
        
        content = content.replace(old_scripts.group(0), new_scripts)
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f'Fixed {file}')
    else:
        print(f'No match in {file}')