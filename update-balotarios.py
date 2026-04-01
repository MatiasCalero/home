import re
import glob

files = glob.glob('balotario-*.html')

for filename in files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Update nav-list
    content = re.sub(
        r'<nav id="navMenu">\s*<ul class="nav-list">\s*<li><a href="index\.html">Inicio</a></li>\s*<li><a href="recursos\.html">Recursos</a></li>\s*</ul>\s*</nav>',
        '<nav id="navMenu"><ul class="nav-list"><li><a href="index.html">Inicio</a></li><li><a href="recursos.html">Recursos</a></li><li><a href="bomberos.html" class="active">Bomberos</a></li></ul></nav>',
        content
    )
    
    # Update breadcrumbs
    content = content.replace('<a href="recursos.html">Bomberos</a>', '<a href="bomberos.html">Bomberos</a>')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Updated {len(files)} balotario files.")
