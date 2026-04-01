document.addEventListener('DOMContentLoaded', () => {

    const tabWrap = document.getElementById('baloTabs');
    const titleEl = document.getElementById('baloTitle');
    const descEl = document.getElementById('baloDesc');
    const tipEl = document.getElementById('baloTip');
    const counterEl = document.getElementById('counter');
    const filtersWrap = document.getElementById('catFilters');
    const searchInput = document.getElementById('searchInput');
    const qListWrap = document.getElementById('questionsList');

    let activeBaloId = 'cultura';
    let currentQuestions = [];
    let currentCats = [];
    let activeCat = 'all';

    // 1. Render Balotario Tabs
    const baloOrder = [
        { id: 'cultura', label: 'Cultura General y Bomberil' },
        { id: 'balo1', label: 'Cultura General' },
        { id: 'balo2', label: 'Cultura General' }
    ];

    function renderTabs() {
        tabWrap.innerHTML = '';
        baloOrder.forEach(t => {
            const btn = document.createElement('button');
            btn.className = 'balo-tab-btn' + (t.id === activeBaloId ? ' active' : '');
            btn.textContent = t.label;
            btn.addEventListener('click', () => {
                if (activeBaloId !== t.id) {
                    activeBaloId = t.id;
                    loadBalotario(activeBaloId);
                    renderTabs();
                }
            });
            tabWrap.appendChild(btn);
        });
    }

    // 2. Load Balotario Data
    function loadBalotario(id) {
        const bd = BALOTARIOS_DATA[id];
        if (!bd) return;

        // Reset UI Search
        searchInput.value = '';
        activeCat = 'all';

        // Set Headings
        titleEl.textContent = bd.title;
        descEl.textContent = bd.desc;

        // Tip box logic
        tipEl.style.display = 'none';
        tipEl.innerHTML = '';

        // Format questions
        currentCats = bd.cats;
        currentQuestions = [];
        if (bd.isRaw) {
            bd.raw.forEach(r => {
                currentQuestions.push({
                    n: r[0],
                    c: r[1],
                    q: r[2],
                    a: r[3] || null
                });
            });
        } else {
            currentQuestions = bd.qs;
        }

        buildFilters();
        buildCards();
        applyFilters();
    }

    // 3. Filters
    function buildFilters() {
        filtersWrap.innerHTML = '';
        const allBtn = document.createElement('button');
        allBtn.className = 'cat-btn active';
        allBtn.textContent = `Todas (${currentQuestions.length})`;
        allBtn.addEventListener('click', () => setFilter('all', allBtn));
        filtersWrap.appendChild(allBtn);

        currentCats.forEach(cat => {
            const count = currentQuestions.filter(q => q.c === cat.id).length;
            if (count > 0) {
                const btn = document.createElement('button');
                btn.className = 'cat-btn';
                btn.textContent = `${cat.label} (${count})`;
                btn.addEventListener('click', () => setFilter(cat.id, btn));
                filtersWrap.appendChild(btn);
            }
        });
    }

    function setFilter(catId, btn) {
        activeCat = catId;
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
    }

    // 4. Build Cards
    function buildCards() {
        qListWrap.innerHTML = '';
        currentQuestions.forEach(item => {
            const el = document.createElement('div');
            el.className = 'q-item';
            el.dataset.cat = item.c;
            el.dataset.q = item.q.toLowerCase();
            el.dataset.hidden = 'false';

            const numSpan = document.createElement('span');
            numSpan.className = 'q-num';
            numSpan.textContent = String(item.n).padStart(2, '0');
            el.appendChild(numSpan);

            const contentDiv = document.createElement('div');
            contentDiv.className = 'q-content';

            const textSpan = document.createElement('span');
            textSpan.className = 'q-text';
            textSpan.textContent = item.q;
            contentDiv.appendChild(textSpan);

            if (item.a) {
                const ansDiv = document.createElement('div');
                ansDiv.className = 'q-ans';
                ansDiv.textContent = item.a;

                el.addEventListener('click', () => {
                    const isShowing = ansDiv.classList.contains('show');
                    if (isShowing) {
                        ansDiv.classList.remove('show');
                    } else {
                        ansDiv.classList.add('show');
                    }
                });

                contentDiv.appendChild(ansDiv);
            }

            el.appendChild(contentDiv);
            qListWrap.appendChild(el);
        });
    }

    // 5. Apply Filters and Search
    function applyFilters() {
        const qText = searchInput.value.toLowerCase().trim();
        let visible = 0;

        document.querySelectorAll('.q-item').forEach(item => {
            const matchesCat = activeCat === 'all' || item.dataset.cat === activeCat;
            const matchesSearch = !qText || item.dataset.q.includes(qText);

            const show = matchesCat && matchesSearch;
            item.dataset.hidden = show ? 'false' : 'true';

            if (show) visible++;
        });

        counterEl.textContent = `Mostrando ${visible} pregunta${visible !== 1 ? 's' : ''}`;
    }

    // Bind search input
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    // Init
    renderTabs();
    loadBalotario(activeBaloId);

    // Make available globally if needed by other scripts
    window.spaBalotarioLogic = {
        load: loadBalotario
    };
});
