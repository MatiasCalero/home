import re

def update_file(filename, updates):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for old, new in updates:
        content = content.replace(old, new)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

# 1. Update index.html
update_file('index.html', [
    (
        '<ul class="nav-list">\n                    <li><a href="index.html" class="active" aria-current="page">Inicio</a></li>\n                    <li><a href="recursos.html">Recursos</a></li>\n                    <li><a href="#convocatorias">Convocatorias</a></li>\n                </ul>',
        '<ul class="nav-list">\n                    <li><a href="index.html" class="active" aria-current="page">Inicio</a></li>\n                    <li><a href="recursos.html">Recursos</a></li>\n                    <li><a href="bomberos.html">Bomberos</a></li>\n                    <li><a href="#convocatorias">Convocatorias</a></li>\n                </ul>'
    )
])
print("Updated index.html")

# 2. Update bomberos.html
with open('bomberos.html', 'r', encoding='utf-8') as f:
    bomberos = f.read()

bomberos = bomberos.replace('<title>Recursos de Economía</title>', '<title>Bomberos — Matias Calero</title>')
bomberos = bomberos.replace('<meta name="description" content="Recursos de Economía - Matias Calero" />', '<meta name="description" content="Bomberos - Matias Calero" />')

old_nav = r'<ul class="nav-list">[\s\S]*?</ul>'
new_nav = '''<ul class="nav-list">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="recursos.html">Recursos</a></li>
                    <li><a href="bomberos.html" class="active">Bomberos</a></li>
                    <li><a href="#convocatorias">Convocatorias</a></li>
                </ul>'''
bomberos = re.sub(old_nav, new_nav, bomberos)

# extract layout
layout_start = '<div class="bomberos-layout">'
layout_end = '<!-- fin .bomberos-layout -->'
start_idx = bomberos.find(layout_start)
end_idx = bomberos.find(layout_end) + len(layout_end)

if start_idx != -1 and end_idx != -1:
    layout_content = bomberos[start_idx:end_idx]
    layout_content = '''
        <div class="bomberos-hero" style="margin-top: 20px;">
            <h2>Bomberos</h2>
            <p>Recursos oficiales, balotarios y materiales de estudio para el CGBVP.</p>
        </div>
''' + layout_content
    
    main_start = bomberos.find('<main>') + len('<main>')
    main_end = bomberos.find('</main>')
    
    bomberos = bomberos[:main_start] + '\n\n' + layout_content + '\n\n' + bomberos[main_end:]

with open('bomberos.html', 'w', encoding='utf-8') as f:
    f.write(bomberos)
print("Updated bomberos.html")

# 3. Update recursos.html
with open('recursos.html', 'r', encoding='utf-8') as f:
    recursos = f.read()

recursos_nav_new = '''<ul class="nav-list">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="recursos.html" class="active">Recursos</a></li>
                    <li><a href="bomberos.html">Bomberos</a></li>
                    <li><a href="#convocatorias">Convocatorias</a></li>
                </ul>'''
recursos = re.sub(old_nav, recursos_nav_new, recursos)

# remove tab button
btn_regex = r'<button class="tab-btn" role="tab" id="tab-bomberos" aria-controls="panel-bomberos" aria-selected="false"[\s\S]*?onclick="switchTab\(\'bomberos\'\)">Bomberos</button>'
recursos = re.sub(btn_regex, '', recursos)

# remove panel
p_start_regex = r'<!-- ===== PANEL: BOMBEROS ===== -->'
p_end_regex = r'<!-- ===== FIN PANEL: BOMBEROS ===== -->'

match_start = re.search(p_start_regex, recursos)
match_end = re.search(p_end_regex, recursos)

if match_start and match_end:
    s_idx = match_start.start()
    e_idx = match_end.end()
    recursos = recursos[:s_idx] + recursos[e_idx:]

with open('recursos.html', 'w', encoding='utf-8') as f:
    f.write(recursos)
print("Updated recursos.html")

