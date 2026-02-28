const CACHE_VERSION = 'v3';
const CACHE_NAME = 'scorp-cache-' + CACHE_VERSION;

// AUTO-GENERATED RESOURCE LIST
const resourcesToCache = [
    './',
    './index.html',
    './about.html',
    './analytics.html',
    './announcement.html',
    './assessment-report.html',
    './assessment.html',
    './book-demo.html',
    './cardshowcase.html',
    './contact.html',
    './faq.html',
    './how-do-I-use-sapphire.html',
    './intelligence.html',
    './mobileUSP.html',
    './privacy_policy.html',
    './sapphire.html',
    './terms_of_use.html',

    './style.css',
    './css/about.css',
    './css/animations.css',
    './css/assessment-report-pdf.css',
    './css/book-demo.css',
    './css/components.css',
    './css/contact.css',
    './css/core.css',
    './css/mobileUSP.css',
    './css/sapphire-assessment.css',
    './css/sections.css',
    './css/smart-analytics.css',
    './css/utilities.css',

    './js/main.js',
    './js/builders/CardDataGenerators.js',
    './js/builders/ScrollCardBuilders.js',
    './js/components/AnalyticsIconRain.js',
    './js/components/CardTiltEffects.js',
    './js/components/CarouselHoverPause.js',
    './js/components/FloatingElementCard.js',
    './js/components/FooterManager.js',
    './js/components/InfiniteScroll.js',
    './js/components/MobilePhoneTilt.js',
    './js/components/NavigationManager.js',
    './js/components/SAccordion.js',
    './js/components/SFloatingButton.js',
    './js/components/WordSlider.js',
    './js/pages/about.js',
    './js/pages/analytics.js',
    './js/pages/assessment-report.js',
    './js/pages/assessment.js',
    './js/pages/book-demo.js',
    './js/pages/contact.js',
    './js/pages/faq.js',
    './js/pages/index.js',
    './js/pages/intelligence.js',
    './js/pages/mobile-usp.js',
    './js/pages/privacy_policy.js',
    './js/pages/sapphire.js',
    './js/pages/terms_of_use.js',
    './js/utils/form-enhancements.js',
    './js/utils/helpers.js',
    './js/visualizations/AnalyticsCanvasAnimation.js',
    './js/visualizations/CapitalAllocationHeatmap.js',
    './js/visualizations/CategoryRetentionViz.js',
    './js/visualizations/ConsolidatedProtection.js',
    './js/visualizations/DepreciationViz.js',
    './js/visualizations/DisposalMethodsDonut.js',
    './js/visualizations/DisposalWaterfallAnalysis.js',
    './js/visualizations/FuelEconomy.js',
    './js/visualizations/InspectionCorrelationViz.js',
    './js/visualizations/NetCostRecovery.js',
    './js/visualizations/OpexOverview.js',
    './js/visualizations/OpexTrendTimeline.js',
    './js/visualizations/ProtectionCategoryGrid.js',
    './js/visualizations/ProtectionTypeBreakdown.js',
    './js/visualizations/PurchaseTimeline.js',

    './assets/data/analytics-data.json',
    './assets/data/india-pincode-database.json',
    './assets/data/assessment-data.js',
    './assets/data/assessment-responses.js',

    './fonts/ScienceGothic-Reg.ttf',

    './assets/videos/Untitled (2).mp4',
    './assets/videos/Untitled.mp4',
    './assets/videos/scorpherovid.mp4',
    './assets/videos/scorpherovid1.mp4',

    './assets/images/Scorp-Logo.png',
    './assets/images/ScorpHero.png',
    './assets/images/sapphire_hero_5.jpeg',
    './assets/images/scorp-sapphire-cropped.png',
    './assets/images/white_bg-highres.png',
    './assets/images/istart_logo.png',
    './assets/images/start-up-india-logo.png'
];

// INSTALL: Precache resources (Robust version for debugging)
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('[Service Worker] Precaching', resourcesToCache.length, 'resources');

                // Try to cache each resource individually to identify failures
                const results = await Promise.allSettled(
                    resourcesToCache.map(url =>
                        cache.add(url).catch(err => {
                            console.error('[Service Worker] FAILED to cache:', url, err);
                            return Promise.reject(url); // Propagate failure
                        })
                    )
                );

                const failed = results.filter(r => r.status === 'rejected');
                if (failed.length > 0) {
                    console.warn('[Service Worker] Installation completed with', failed.length, 'failures.');
                    // We still skip waiting even if some failed, to allow development to proceed
                } else {
                    console.log('[Service Worker] All resources cached successfully');
                }

                return self.skipWaiting();
            })
    );
});

// ACTIVATE: Clean old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => name.startsWith('scorp-cache-') && name !== CACHE_NAME)
                        .map(name => {
                            console.log('[Service Worker] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Activation complete');
                return self.clients.claim();
            })
    );
});

// FETCH: Cache-first with network fallback
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request)
                    .then(networkResponse => {
                        // Cache GET requests only
                        if (event.request.method === 'GET' && networkResponse.status === 200) {
                            const responseToCache = networkResponse.clone();
                            caches.open(CACHE_NAME).then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        }
                        return networkResponse;
                    });
            })
            .catch(error => {
                console.error('[Service Worker] Fetch failed:', error);
                // Offline fallback for HTML pages
                if (event.request.destination === 'document') {
                    return caches.match('/index.html');
                }
            })
    );
});
