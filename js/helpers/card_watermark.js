export function initCardWatermarks() {
    console.log('🎨 Watermark init running...');
    const cards = document.querySelectorAll('.s-card-watermark, .s-pic-card-watermark, .s-content-card-watermark');
    console.log('🎨 Cards found:', cards.length);

    const colorMap = {
        's-icon-primary':       'var(--s-primary)',
        's-icon-secondary':     'var(--s-gray-600)',
        's-icon-success':       'var(--s-success)',
        's-icon-success-soft':  'var(--s-success-soft)',
        's-icon-danger':        'var(--s-danger)',
        's-icon-warning':       'var(--s-warning)',
        's-icon-attention':     'var(--s-attention)',
        's-icon-info':          'var(--s-info)',
        's-icon-info-special':  'var(--s-info-special)',
        's-icon-royal':         'var(--s-royal)',
        's-icon-royal-soft':    'var(--s-royal-light)',
        's-icon-pop':           'var(--s-pop)',
        's-icon-cyan':          'var(--s-cyan-500)',
        's-icon-green':         'var(--s-green-500)',
        's-icon-amber':         'var(--s-amber)',
        's-icon-purple':        'var(--s-purple-500)',
        's-icon-indigo':        'var(--s-indigo-500)',
        's-icon-teal':          'var(--s-teal-500)',
        's-icon-red':           'var(--s-red-600)',
        's-icon-slate':         'var(--s-gray-500)',
        's-icon-neutral':       'var(--s-neutral-500)',
        's-icon-blue':          'var(--s-primary)',
        's-icon-blue-1':        'var(--s-primary-soft)',
        's-icon-blue-2':        'var(--s-primary)',
        's-icon-blue-3':        'var(--s-accent)',
        's-icon-blue-4':        'var(--s-primary)',
        's-icon-blue-5':        'var(--s-accent)',
        's-icon-gray-50':       'var(--s-gray-50)',
        's-icon-gray-100':      'var(--s-gray-100)',
        's-icon-gray-200':      'var(--s-gray-200)',
        's-icon-gray-300':      'var(--s-gray-300)',
        's-icon-gray-400':      'var(--s-gray-400)',
        's-icon-gray-500':      'var(--s-gray-500)',
        's-icon-gray-600':      'var(--s-gray-600)',
        's-icon-gray-700':      'var(--s-gray-700)',
        's-icon-gray-800':      'var(--s-gray-800)',
        's-icon-gray-900':      'var(--s-gray-900)',
        's-icon-black':         'var(--s-black)',
        's-icon-white':         'var(--s-gray-400)',
        's-icon-frost':         'var(--s-primary)',
        's-icon-linkedin':      'var(--s-bg-linkedin)',
        's-icon-youtube':       'var(--s-bg-youtube)',
        's-icon-instagram':     'var(--s-bg-instagram)',
        's-icon-facebook':      'var(--s-bg-facebook)',
        's-icon-x':             'var(--s-bg-x)',
        's-icon-discord':       'var(--s-bg-discord)',
        's-icon-github':        'var(--s-bg-github)',
        's-icon-whatsapp':      'var(--s-bg-whatsapp)',
    };

    // Cache fetched SVGs so identical icons don't re-fetch
    const svgCache = {};

    async function applyWatermark(card) {
        const wmIcon = card.querySelector('.s-wm-icon');
        if (!wmIcon) return;

        const icon = card.querySelector('[class*="bi-"], .fas, .far, .fal');
        if (!icon) return;

        const classes = [...icon.classList];
        let maskUrl = null;

        const biClass = classes.find(c => c.startsWith('bi-'));
        if (biClass) {
            const name = biClass.replace('bi-', '');
            maskUrl = `https://cdn.jsdelivr.net/npm/bootstrap-icons/icons/${name}.svg`;
        }

        if (!maskUrl) {
            const faClass = classes.find(c =>
                c.startsWith('fa-') &&
                !['fa-solid', 'fa-regular', 'fa-light', 'fa-brands'].includes(c)
            );
            if (faClass) {
                const name = faClass.replace('fa-', '');
                maskUrl = `https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free/svgs/solid/${name}.svg`;
            }
        }

        if (!maskUrl) return;

        // Resolve color
        const iconWrapper = card.querySelector('[class*="s-icon-"]');
        let color = 'var(--s-primary)';
        if (iconWrapper) {
            const colorClass = [...iconWrapper.classList].find(c => colorMap[c]);
            if (colorClass) color = colorMap[colorClass];
        }

        // Fetch SVG and inline as data URL (bypasses CORS on mask-image)
        try {
            if (!svgCache[maskUrl]) {
                const res = await fetch(maskUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                svgCache[maskUrl] = await res.text();
            }
            const dataUrl = `url("data:image/svg+xml,${encodeURIComponent(svgCache[maskUrl])}")`;

            wmIcon.style.background = color;
            wmIcon.style.backgroundClip = 'unset';
            wmIcon.style.webkitBackgroundClip = 'unset';
            wmIcon.style.webkitMaskImage = dataUrl;
            wmIcon.style.maskImage = dataUrl;
            wmIcon.style.webkitMaskSize = 'contain';
            wmIcon.style.maskSize = 'contain';
            wmIcon.style.webkitMaskRepeat = 'no-repeat';
            wmIcon.style.maskRepeat = 'no-repeat';

        } catch (e) {
            console.warn(`🎨 Watermark failed for ${maskUrl}:`, e.message);
            wmIcon.style.opacity = '0'; // hide silently on failure
        }
    }

    cards.forEach(applyWatermark);
}