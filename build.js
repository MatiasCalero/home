const fs = require('fs');

try {
    // 1. INDEX.HTML
    let index = fs.readFileSync('index.html', 'utf8');
    const indexNavRegex = /<ul class="nav-list">[\s\S]*?<\/ul>/;
    const newIndexNav = `<ul class="nav-list">
                    <li><a href="index.html" class="active" aria-current="page">Inicio</a></li>
                    <li><a href="recursos.html">Recursos</a></li>
                    <li><a href="bomberos.html">Bomberos</a></li>
                    <li><a href="#convocatorias">Convocatorias</a></li>
                </ul>`;
    index = index.replace(indexNavRegex, newIndexNav);
    fs.writeFileSync('index.html', index);
    console.log("Updated index.html");

    // 2. BOMBEROS.HTML
    let bomberos = fs.readFileSync('bomberos.html', 'utf8');
    bomberos = bomberos.replace('<title>Recursos de Economía</title>', '<title>Bomberos — Matias Calero</title>');
    bomberos = bomberos.replace('<meta name="description" content="Recursos de Economía - Matias Calero" />', '<meta name="description" content="Bomberos - Matias Calero" />');
    
    const bomberosNav = `<ul class="nav-list">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="recursos.html">Recursos</a></li>
                    <li><a href="bomberos.html" class="active">Bomberos</a></li>
                    <li><a href="#convocatorias">Convocatorias</a></li>
                </ul>`;
    bomberos = bomberos.replace(/<ul class="nav-list">[\s\S]*?<\/ul>/, bomberosNav);

    const layoutStart = '<div class="bomberos-layout">';
    const layoutEndStr = '<!-- fin .bomberos-layout -->';
    let bStart = bomberos.indexOf(layoutStart);
    let bEnd = bomberos.indexOf(layoutEndStr) + layoutEndStr.length;
    let onlyBomberosLayout = bomberos.substring(bStart, bEnd);

    // add an extra wrapper for presentation
    onlyBomberosLayout = `
        <div class="bomberos-hero" style="margin-top: 20px;">
            <h2>Bomberos</h2>
            <p>Recursos oficiales, balotarios y materiales de estudio para el CGBVP.</p>
        </div>
        ` + onlyBomberosLayout;

    // replace main content
    const mStart = bomberos.indexOf('<main>') + '<main>'.length;
    const mEnd = bomberos.indexOf('</main>');
    bomberos = bomberos.substring(0, mStart) + '\n\n' + onlyBomberosLayout + '\n\n' + bomberos.substring(mEnd);
    fs.writeFileSync('bomberos.html', bomberos);
    console.log("Updated bomberos.html");

    // 3. RECURSOS.HTML
    let recursos = fs.readFileSync('recursos.html', 'utf8');
    const recursosNav = `<ul class="nav-list">
                    <li><a href="index.html">Inicio</a></li>
                    <li><a href="recursos.html" class="active">Recursos</a></li>
                    <li><a href="bomberos.html">Bomberos</a></li>
                    <li><a href="#convocatorias">Convocatorias</a></li>
                </ul>`;
    recursos = recursos.replace(/<ul class="nav-list">[\s\S]*?<\/ul>/, recursosNav);
    
    // Remove the bomberos tab button
    recursos = recursos.replace(/<button class="tab-btn" role="tab" id="tab-bomberos"[\s\S]*?>Bomberos<\/button>/, '');

    // Remove the bomberos panel
    const pStartRegex = /<!-- ===== PANEL: BOMBEROS ===== -->/;
    const pEndRegex = /<!-- ===== FIN PANEL: BOMBEROS ===== -->/;
    
    let pMatchStart = recursos.match(pStartRegex);
    let pMatchEnd = recursos.match(pEndRegex);
    
    if (pMatchStart && pMatchEnd) {
        let pStartIdx = pMatchStart.index;
        let pEndIdx = pMatchEnd.index + pMatchEnd[0].length;
        recursos = recursos.substring(0, pStartIdx) + recursos.substring(pEndIdx);
    }
    
    fs.writeFileSync('recursos.html', recursos);
    console.log("Updated recursos.html");

} catch(e) {
    console.error(e);
}
