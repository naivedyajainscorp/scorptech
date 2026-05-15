// ═══════════════════════════════════════════
// INDUSTRY INDEX PAGE — index.html
// ═══════════════════════════════════════════
if (document.getElementById('industrySearch'))
{
	const searchInput = document.getElementById('industrySearch');
	const clearBtn = document.getElementById('industrySearchClear');
	const dropdown = document.getElementById('industryAutocomplete');
	const statusEl = document.getElementById('industrySearchStatus');
	const allCards = document.querySelectorAll('.s-ind-card-wrap');
	const allSections = document.querySelectorAll('.s-ind-section');
	const NAVBAR_OFFSET = 88;

	const index = [];
	allCards.forEach(card =>
	{
		const title = card.dataset.title || '';
		const category = card.dataset.category || '';
		const pills = (card.dataset.pills || '').split(',').map(p => p.trim()).filter(Boolean);
		index.push(
		{
			card,
			title,
			category,
			pills
		});
	});

	const tree = {};
	index.forEach(entry =>
	{
		const cat = entry.category.replace(/&amp;/g, '&');
		if (!tree[cat]) tree[cat] = [];
		tree[cat].push(
		{
			title: entry.title.replace(/&amp;/g, '&'),
			card: entry.card,
			pills: entry.pills.map(p => p.replace(/&amp;/g, '&'))
		});
	});

	function normalise(str)
	{
		return str.replace(/&amp;/g, '&').replace(/&#\d+;/g, '').toLowerCase().trim();
	}

	function scrollToSearch()
	{
		const top = searchInput.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET;
		window.scrollTo(
		{
			top,
			behavior: 'smooth'
		});
	}

	function renderDropdown(query)
	{
		const q = normalise(query || '');
		dropdown.innerHTML = '';
		let hasAny = false;

		Object.entries(tree).forEach(([cat, cards]) =>
		{
			const normCat = normalise(cat);
			const catMatch = !q || normCat.includes(q);

			const matchedCards = cards.map(entry =>
			{
				const normTitle = normalise(entry.title);
				const titleMatch = !q || normTitle.includes(q);
				const matchedPills = q ? entry.pills.filter(p => normalise(p).includes(q)) : entry.pills;
				return {
					...entry,
					titleMatch,
					matchedPills
				};
			}).filter(entry => catMatch || entry.titleMatch || entry.matchedPills.length);

			if (!catMatch && !matchedCards.length) return;
			hasAny = true;

			const catEl = document.createElement('div');
			catEl.className = 's-ind-suggestion-row s-ind-row-cat';
			catEl.style.cssText = 'padding:0.6rem 1rem 0.3rem 1rem;display:flex;align-items:center;gap:0.5rem;border-bottom:1px solid var(--s-border);cursor:pointer;';
			catEl.innerHTML = `
        <i class="fas fa-layer-group s-text-primary"></i>
        <span class="s-text-primary" style="font-family:'Science Gothic',sans-serif;font-weight:700;font-style:italic;letter-spacing:0.04em;text-transform:uppercase">${cat}</span>
      `;
			catEl.addEventListener('mousedown', e =>
			{
				e.preventDefault();
				searchInput.value = cat;
				filterCards(cat);
				dropdown.style.display = 'none';
				clearBtn.style.display = 'block';
			});
			dropdown.appendChild(catEl);

			matchedCards.forEach(entry =>
			{
				const showTitle = catMatch || entry.titleMatch || entry.matchedPills.length;
				if (!showTitle) return;

				const indEl = document.createElement('div');
				indEl.className = 's-ind-suggestion-row s-ind-row-ind';
				indEl.style.cssText = 'padding:0.45rem 1rem 0.45rem 2rem;display:flex;align-items:center;gap:0.5rem;border-bottom:1px solid var(--s-border);cursor:pointer;';
				indEl.innerHTML = `
          <span class="s-ind-tree-branch s-text-secondary">├─</span>
          <i class="fas fa-industry s-text-secondary"></i>
          <span class="s-text-secondary" style="font-weight:400">${entry.title}</span>
        `;
				indEl.addEventListener('mousedown', e =>
				{
					e.preventDefault();
					searchInput.value = entry.title;
					filterCards(entry.title);
					dropdown.style.display = 'none';
					clearBtn.style.display = 'block';
					setTimeout(() =>
					{
						entry.card.scrollIntoView(
						{
							behavior: 'smooth',
							block: 'center'
						});
						const pic = entry.card.querySelector('.s-pic-card');
						pic.style.outline = '2.5px solid var(--s-primary)';
						setTimeout(() =>
						{
							pic.style.outline = '';
						}, 2000);
					}, 120);
				});
				dropdown.appendChild(indEl);

				const pillsToShow = q ? entry.matchedPills : [];
				pillsToShow.forEach((pill, pi) =>
				{
					const isLast = pi === pillsToShow.length - 1;
					const pillEl = document.createElement('div');
					pillEl.className = 's-ind-suggestion-row s-ind-row-pill';
					pillEl.style.cssText = 'padding:0.35rem 1rem 0.35rem 3.2rem;display:flex;align-items:center;gap:0.5rem;border-bottom:1px solid var(--s-border);cursor:pointer;';
					pillEl.innerHTML = `
            <span style="color:var(--s-text-muted);font-size:0.68rem;flex-shrink:0">${isLast ? '└─' : '├─'}</span>
            <i class="fas fa-tag" style="color:var(--s-text-muted);font-size:0.68rem;flex-shrink:0"></i>
            <span style="font-size:0.78rem;font-weight:400;color:var(--s-text-muted)">${pill}</span>
            <span style="font-size:0.68rem;color:var(--s-text-muted);margin-left:auto;opacity:0.6">in ${entry.title}</span>
          `;
					pillEl.addEventListener('mousedown', e =>
					{
						e.preventDefault();
						searchInput.value = pill;
						filterCards(pill);
						dropdown.style.display = 'none';
						clearBtn.style.display = 'block';
						setTimeout(() =>
						{
							entry.card.scrollIntoView(
							{
								behavior: 'smooth',
								block: 'center'
							});
							const pic = entry.card.querySelector('.s-pic-card');
							pic.style.outline = '2.5px solid var(--s-primary)';
							setTimeout(() =>
							{
								pic.style.outline = '';
							}, 2000);
						}, 120);
					});
					dropdown.appendChild(pillEl);
				});
			});
		});

		if (!hasAny)
		{
			const empty = document.createElement('div');
			empty.style.cssText = 'padding:1rem;text-align:center;font-size:0.83rem;color:var(--s-text-muted)';
			empty.textContent = 'No industries found';
			dropdown.appendChild(empty);
		}

		dropdown.style.display = 'block';
	}

	function filterCards(query)
	{
		const q = normalise(query);
		if (!q)
		{
			resetAll();
			return;
		}
		let visibleCount = 0;
		allSections.forEach(section =>
		{
			let sectionHasMatch = false;
			section.querySelectorAll('.s-ind-card-wrap').forEach(card =>
			{
				const title = normalise(card.dataset.title || '');
				const category = normalise(card.dataset.category || '');
				const pills = normalise(card.dataset.pills || '');
				const match = title.includes(q) || category.includes(q) || pills.includes(q);
				card.style.display = match ? '' : 'none';
				if (match)
				{
					sectionHasMatch = true;
					visibleCount++;
				}
			});
			section.style.display = sectionHasMatch ? '' : 'none';
		});
		statusEl.textContent = visibleCount ?
			`${visibleCount} industr${visibleCount === 1 ? 'y' : 'ies'} found` :
			'No industries found for that search';
		clearBtn.style.display = 'block';
	}

	function resetAll()
	{
		allCards.forEach(c => c.style.display = '');
		allSections.forEach(s => s.style.display = '');
		statusEl.textContent = '';
		clearBtn.style.display = 'none';
		dropdown.style.display = 'none';
	}

	searchInput.addEventListener('focus', () =>
	{
		scrollToSearch();
		renderDropdown(searchInput.value.trim());
	});

	searchInput.addEventListener('input', () =>
	{
		const q = searchInput.value.trim();
		if (!q)
		{
			resetAll();
			renderDropdown('');
			return;
		}
		clearBtn.style.display = 'block';
		renderDropdown(q);
		filterCards(q);
	});

	searchInput.addEventListener('blur', () =>
	{
		setTimeout(() =>
		{
			dropdown.style.display = 'none';
		}, 180);
	});

	searchInput.addEventListener('keydown', function (e)
	{
		if (e.key === 'Escape')
		{
			dropdown.style.display = 'none';
			searchInput.blur();
		}
	});

	clearBtn.addEventListener('click', () =>
	{
		searchInput.value = '';
		resetAll();
		renderDropdown('');
		searchInput.focus();
	});
}


// ═══════════════════════════════════════════════════════════════
// CORE SUITE STICKY NAV — sapphire_core_suite.html
// ═══════════════════════════════════════════════════════════════
function initCspNav() {

	const cspSectionIds = [
		'mod-workplace',
		'mod-user',
		'mod-master-data',
		'mod-inventory',
		'mod-requests',
		'mod-reporting',
		'mod-inspection',
		'mod-resolution',
		'mod-maintenance',
		'mod-workstation',
		'mod-analytics',
		'mod-fleet'
	];

	const cspNavItems = document.querySelectorAll('.csp-nav-item');
	const cspNav = document.querySelector('.csp-nav');

	const cspNavStart = document.getElementById('mod-workplace');
	const cspNavEnd = document.getElementById('mod-fleet');

	if (!cspNav || !cspNavItems.length) return;

	// ── TRUE PAGE OFFSET ─────────────────────────────────────
	function cspGetTop(el) {
		let top = 0;

		while (el) {
			top += el.offsetTop;
			el = el.offsetParent;
		}

		return top;
	}

	// ── CLICK → SMOOTH SCROLL ───────────────────────────────
	cspNavItems.forEach(item => {
		item.addEventListener('click', e => {
			e.preventDefault();

			const target = document.getElementById(item.dataset.target);

			if (!target) return;

			const navbar =
				document.querySelector('.s-navbar') ||
				document.querySelector('.navbar') ||
				document.querySelector('[class*="navbar"]');

			let navbarHeight = 88;

			if (navbar) {
				const cs = window.getComputedStyle(navbar);

				navbarHeight =
					navbar.offsetHeight +
					parseFloat(cs.marginTop || 0) +
					parseFloat(cs.marginBottom || 0);
			}

			const cspNavHeight = cspNav ? cspNav.offsetHeight : 0;

			const top =
				cspGetTop(target) -
				navbarHeight -
				cspNavHeight;

			window.scrollTo({
				top,
				behavior: 'smooth'
			});
		});
	});

	// ── SHOW / HIDE ──────────────────────────────────────────
	function checkCspNavVisibility() {

		if (!cspNavStart || !cspNavEnd) return;

		const scrollY = window.scrollY;

		const startTop = cspGetTop(cspNavStart);

		const endBottom =
			cspGetTop(cspNavEnd) +
			cspNavEnd.offsetHeight -
			200;

		cspNav.classList.toggle(
			'csp-nav-visible',
			scrollY >= startTop && scrollY < endBottom
		);
	}

	window.addEventListener('scroll', checkCspNavVisibility, {
		passive: true
	});

	checkCspNavVisibility();

	// ── ACTIVE TAB ON SCROLL ────────────────────────────────
	function scrollCspNavToActive() {

		const navInner = document.querySelector('.csp-nav-inner');

		const activeItem =
			navInner?.querySelector('.csp-nav-item.active');

		if (!navInner || !activeItem) return;

		navInner.scrollTo({
			left:
				activeItem.offsetLeft -
				navInner.offsetWidth / 2 +
				activeItem.offsetWidth / 2,
			behavior: 'smooth'
		});
	}

	function updateCspNav() {

		const navbar =
			document.querySelector('.s-navbar') ||
			document.querySelector('.navbar') ||
			document.querySelector('[class*="navbar"]');

		const navH =
			(navbar ? navbar.offsetHeight : 88) +
			(cspNav ? cspNav.offsetHeight : 0) +
			48;

		const scrollY = window.scrollY + navH;

		let current = '';

		cspSectionIds.forEach(id => {

			const el = document.getElementById(id);

			if (el && cspGetTop(el) <= scrollY) {
				current = id;
			}
		});

		cspNavItems.forEach(item => {
			item.classList.toggle(
				'active',
				item.dataset.target === current
			);
		});

		scrollCspNavToActive();
	}

	window.addEventListener('scroll', updateCspNav, {
		passive: true
	});

	updateCspNav();

	console.log('✅ csp-nav initialized');
}

initCspNav();