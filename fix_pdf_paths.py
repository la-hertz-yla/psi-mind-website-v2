import os
import re
from bs4 import BeautifulSoup

subjects = {
    'cours_info.html': 'info',
    'cours_math.html': 'math',
    'cours_physique.html': 'physique',
    'cours_si.html': 'si',
    'cours-chimie.html': 'chimie',
    'pratique_info.html': 'info',
    'pratique_math.html': 'math',
    'pratique_physique.html': 'physique',
    'pratique_si.html': 'si',
    'pratique.chimie.html': 'chimie',
    'resume_chimie.html': 'chimie',
    'resume_info.html': 'info',
    'resume_math.html': 'math',
    'resume_physique.html': 'physique',
    'resume_si.html': 'si'
}

def clean_slug(text):
    # remove prefix
    text = re.sub(r'^(Cours|Exercices|Résumé) — ', '', text)
    # lowercase, replace spaces and — with -
    text = text.lower().replace(' ', '-').replace('—', '-')
    # remove accents
    text = text.replace('é', 'e').replace('à', 'a').replace('è', 'e').replace('ù', 'u').replace('â', 'a').replace('ê', 'e').replace('î', 'i').replace('ô', 'o').replace('û', 'u').replace('ç', 'c')
    # remove special chars
    text = re.sub(r'[^a-z0-9-]', '', text)
    return text

for file in subjects:
    subject = subjects[file]
    path = f'src/HTML/{file}'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    soup = BeautifulSoup(content, 'html.parser')
    chapitres = soup.find_all('div', class_='chapitre-section')
    
    for chapitre in chapitres:
        title = chapitre.find('div', class_='chapitre-title').text
        match = re.search(r'Chapitre (\d+) — (.+)', title)
        if match:
            ch_num = match.group(1)
            pdf_items = chapitre.find_all('div', class_='pdf-item')
            for item in pdf_items:
                pdf_name = item.find('div', class_='pdf-name').text
                slug = clean_slug(pdf_name)
                new_path = f'pdfs/{subject}/ch{ch_num}-{slug}.pdf'
                # update href
                a = item.find('a', class_='btn-download')
                a['href'] = new_path
                # update data-file
                btn = item.find('button', class_='fav-btn')
                btn['data-file'] = new_path
                # data-title
                btn['data-title'] = pdf_name
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(str(soup))
    
    print(f'Updated {file}')