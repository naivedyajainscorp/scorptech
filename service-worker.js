const CACHE_VERSION = 'v3';
const CACHE_NAME = 'scorp-cache-' + CACHE_VERSION;

// AUTO-GENERATED RESOURCE LIST
const resourcesToCache = [
    '/',
    '/index.html',
    '/about.html',
    '/analytics.html',
    '/announcement.html',
    '/assessment-report.html',
    '/assessment.html',
    '/book-demo.html',
    '/cardshowcase.html',
    '/contact.html',
    '/dashboard11.html',
    '/faq.html',
    '/how-do-I-use-sapphire.html',
    '/intelligence.html',
    '/mobileUSP.html',
    '/privacy_policy.html',
    '/sapphire.html',
    '/terms_of_use.html',

    '/style.css',
    '/css/about.css',
    '/css/animations.css',
    '/css/assessment-report-pdf.css',
    '/css/book-demo.css',
    '/css/components.css',
    '/css/contact.css',
    '/css/core.css',
    '/css/mobileUSP.css',
    '/css/sapphire-assessment.css',
    '/css/sections.css',
    '/css/smart-analytics.css',
    '/css/utilities.css',

    '/js/main.js',
    '/js/builders/CardDataGenerators.js',
    '/js/builders/ScrollCardBuilders.js',
    '/js/components/AnalyticsIconRain.js',
    '/js/components/CardTiltEffects.js',
    '/js/components/CarouselHoverPause.js',
    '/js/components/FloatingElementCard.js',
    '/js/components/FooterManager.js',
    '/js/components/InfiniteScroll.js',
    '/js/components/MobilePhoneTilt.js',
    '/js/components/NavigationManager.js',
    '/js/components/SAccordion.js',
    '/js/components/SFloatingButton.js',
    '/js/components/WordSlider.js',
    '/js/pages/about.js',
    '/js/pages/analytics.js',
    '/js/pages/assessment-report.js',
    '/js/pages/assessment.js',
    '/js/pages/book-demo.js',
    '/js/pages/contact.js',
    '/js/pages/faq.js',
    '/js/pages/index.js',
    '/js/pages/intelligence.js',
    '/js/pages/mobile-usp.js',
    '/js/pages/privacy_policy.js',
    '/js/pages/sapphire.js',
    '/js/pages/terms_of_use.js',
    '/js/utils/form-enhancements.js',
    '/js/utils/helpers.js',
    '/js/visualizations/AnalyticsCanvasAnimation.js',
    '/js/visualizations/CapitalAllocationHeatmap.js',
    '/js/visualizations/CategoryRetentionViz.js',
    '/js/visualizations/ConsolidatedProtection.js',
    '/js/visualizations/DepreciationViz.js',
    '/js/visualizations/DisposalMethodsDonut.js',
    '/js/visualizations/DisposalWaterfallAnalysis.js',
    '/js/visualizations/FuelEconomy.js',
    '/js/visualizations/InspectionCorrelationViz.js',
    '/js/visualizations/NetCostRecovery.js',
    '/js/visualizations/OpexOverview.js',
    '/js/visualizations/OpexTrendTimeline.js',
    '/js/visualizations/ProtectionCategoryGrid.js',
    '/js/visualizations/ProtectionTypeBreakdown.js',
    '/js/visualizations/PurchaseTimeline.js',

    '/assets/data/analytics-data.json',
    '/assets/data/india-pincode-database.json',
    '/assets/data/assessment-data.js',
    '/assets/data/assessment-responses.js',

    '/fonts/ScienceGothic-Reg.ttf',

    '/assets/videos/Untitled (2).mp4',
    '/assets/videos/Untitled.mp4',
    '/assets/videos/scorpherovid.mp4',
    '/assets/videos/scorpherovid1.mp4',

    '/assets/imageHelp/AQM3I5Hz4btdb7p1vHZYV0WsV89bx1cr-oXMRzKd-0Inc6xmanoAz2dcWDKALxSUP9od0hP9GPTYysDBfbNcO5Z8.jpeg',
    '/assets/imageHelp/AQMHSBR6nTObKG2UxLJ4goIlcGum4nmprql0HLnIq_n35IBLfchQUbkFVkIGL2Pm8k6frumjPkoATOgrNg3M5hdn.jpeg',
    '/assets/imageHelp/AQMQBj1TIcN7E-5kYfLVWk9Au9JoWXwKeTvbgw7FlQ-WOH-lBJnXtNSahXgfrVqP20k-AH2p6_f7nO_IpqeX_q6W.jpeg',
    '/assets/imageHelp/AQNN2XfsHYRrCIlrls1UK3uynzR_jUv-bnV-DplIi_DLzepippXKgOs7GO6mBCyyyxkb4nXniu3scLAMlRH0fgXx.jpeg',
    '/assets/imageHelp/AQNWK39_glqs4KFJc8NlCgbZDUjtD7WaSCIiHzpJXz3Bu-JOwmcJJnm3qBVzvfnXZ4GVqQVrIudVp5eAmaaLEmkI.jpeg',
    '/assets/imageHelp/AQOWBv3mT2gVGKni4XoCxfcGGZoErJT8TknHiyip963TKHCaK7CnlbZV_8zn9nvis5yVm1tnWGbrnZI8OMLQ0QGx.jpeg',
    '/assets/imageHelp/AQOYLXpdvqlIpGXrkbDOas1LvTvSs0OyUTbSZzyEtavEDrNxpttZzWaMoAGK0IkZAzrDDdDCD4i_IQLZ2zrnJ1Gy.jpeg',
    '/assets/imageHelp/AQOkrfODBvsKRR9Ly-syI1hDP0Yzc-xacaq_E2lcwNHfkumvw6bYZLAvRF6CBp7hcMuVNy4Q8BurjxHXE2uIDgkT.jpeg',
    '/assets/imageHelp/AQOlVcis4t8FPZf2wYURiihcil1cxhhvKFwt3Ec-59GYkSAgjNpFYKSojYuE6WgHaZmHTcpOXidDZwssCzvHnzed.jpeg',
    '/assets/imageHelp/AQOmmkd1UuNIvvDz538nqDtMLd8iaqswJiYxnh_csMuxltwI6H8tdd-_ucFEGLmOQqkNjro-X7H3dpYGD8yP45oX.jpeg',
    '/assets/imageHelp/AQOnjYJtzzt3Lhx_F55ab8T1VyPte3MWfhjKmQ3I0RejOSZBwi6qv64rhDGadyEoIw6tW_J5YDJ_MwuepKM043Al.jpeg',
    '/assets/imageHelp/AQOtWX9lT34ZggCQxaCCwRm4V-Rac4fh5-xvP26iZiuEX3vMJmGR1bxz558rAAzuUHfbNFIuJNgxmemFfOgUwKgB.jpeg',
    '/assets/imageHelp/AQP7ixIs3jVRxBVvmg026ShYMY2UVorN9uB-I-Qrx3JGgiN2MdArpJZwdXdvC3EkOjrgCxWB3hlw3-qAIfG6fDIL.jpeg',
    '/assets/imageHelp/AQPFq9WmSCtdbQteZS363Bk5SeehnfhSozVIdY4MNieK_KvDYhTxZMbUvGxZZM33nzX6EuJ1daF4qcR7tB0rgS2V.jpeg',
    '/assets/imageHelp/AQPNQg_bpeiGPi3gzpXkALNM-vMFNxllahWY4Rr3kprAf3mdo-9LJoV3JJZKnWtSfmKWSPW_hNvlVJLGLufdbWry.jpeg',
    '/assets/imageHelp/AQPRJPZ_WaONu7EV14erFVj9TZkrreqTSiZHMd9zt7kppga5Am-dwwP1d94yQ-UHN2ssV7DuPKDthUYPZ2Jr0x6j.jpeg',
    '/assets/imageHelp/AQPXapXplI-pyk10DondhcKZYAolSGWZbgDo6XmSfNAFMA7LvvCU0DhxwOUrXH0Qn_aBAqe0T7v1TohB4rO6nJM7.jpeg',
    '/assets/imageHelp/AQPbhfGoEkMEJ4I7ip063Fx8QgH6i3NC-tGzP_aQ5syKwMf224Wyi67CRwnGiL4IFe1HFDXP4EmBj_ggFW1WFYpU.jpeg',
    '/assets/imageHelp/AQPpJZ13VFiRS7wzdyU4auqsfE3AiVDC6ogZEWMtQnukYPFQR02OYT3iuUsVsJSutZMQz0XcxwbgxlkT3QiA0SYD.jpeg',
    '/assets/imageHelp/AQPy1z2GXAfGxDZyyNj6pdITdcZ8UGWhLNnqHAUTlHIDNqJIwIqs7T8UI25LPQveWQPdd4TvI57vWrZ0xQr-ikXo.jpeg',
    '/assets/imageHelp/designarena_image_04aeufsm.png',
    '/assets/imageHelp/designarena_image_6fdp5ch3.png',
    '/assets/imageHelp/designarena_image_7nrudz6d.png',
    '/assets/imageHelp/designarena_image_80kpbo4q.png',
    '/assets/imageHelp/designarena_image_8bb5vzo2.png',
    '/assets/imageHelp/designarena_image_air02vbm.png',
    '/assets/imageHelp/designarena_image_i6fqp3va.png',
    '/assets/imageHelp/designarena_image_ltvphng0.png',
    '/assets/imageHelp/designarena_image_nuqjdgv3.png',
    '/assets/imageHelp/designarena_image_uuhc9wc3.jpg',
    '/assets/imageHelp/designarena_image_uyddb9ss.png',
    '/assets/imageHelp/designarena_image_yn7mifha.png',

    '/assets/images2/inspection-reporting-modal-hero.jpg',
    '/assets/images2/inventory-general_inventory.png',
    '/assets/images2/inventory-hand_tool_reserve.png',
    '/assets/images2/inventory-reserve.png',
    '/assets/images2/request-issue_request.png',
    '/assets/images2/request-location_change.png',
    '/assets/images2/request-retrun_request.png',
    '/assets/images2/request-surrender_request.png',
    '/assets/images2/resolution-repair.png',
    '/assets/images2/user-management-4.png',
    '/assets/images2/workplace_management-Owner_citywide_office.png',

    '/assets/images_industries/autumn-byteplus_a_A_dramatic_construct.jpeg',
    '/assets/images_industries/autumn-byteplus_a_A_massive_modern_war.jpeg',
    '/assets/images_industries/autumn-byteplus_a_A_pristine_modern_ho.jpeg',
    '/assets/images_industries/autumn-byteplus_a_A_professional_autom.jpeg',
    '/assets/images_industries/autumn-byteplus_a_A_vast_industrial_ma.jpeg',
    '/assets/images_industries/autumn-byteplus_a_A_wide_horizontal_is.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Airport_Hangars_A_m.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Amusement_Parks_&_Ev.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Cargo_TerminalsA_sta.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Clubs_&_Leisure_Faci.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Concert_HallsA_magni.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Corporate_Offices_A_.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Fitness_Centers_&_Gy.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Ground_support_bays_.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Hotels,_Guest_Houses.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Logistics_&_Fleet_Op.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Movie_TheatersA_luxu.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Real_Estate_Develope.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Restaurants_&_CafesA.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Retail_Chains_&_Shop.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Schools,_Universitie.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Shipping_Ports_&_Doc.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Training_&_Vocationa.jpeg',
    '/assets/images_industries/autumn-byteplus_a_Transportation_Agenc.jpeg',

    '/assets/images/4831948_2518593.jpg',
    '/assets/images/5083799_2650393.jpg',
    '/assets/images/5083802_2650404.jpg',
    '/assets/images/6166232_17448.jpg',
    '/assets/images/Flag_of_India.svg.webp',
    '/assets/images/Ministry_of_Corporate_Affairs_India.svg',
    '/assets/images/Sapphire-hero-bg.jpg',
    '/assets/images/Scorp-Logo.png',
    '/assets/images/ScorpHero.png',
    '/assets/images/book-demo-hero.png',
    '/assets/images/built_for_the_real_world.png',
    '/assets/images/complete_software_ecosystem.png',
    '/assets/images/contact-hero.png',
    '/assets/images/continuously_evolving.png',
    '/assets/images/culture-tray.jpg',
    '/assets/images/demo image analytics.jpg',
    '/assets/images/demo-1.jpg',
    '/assets/images/effortless_to_use.png',
    '/assets/images/emblem-of-india-seeklogo.png',
    '/assets/images/founding-hero-1.jpg',
    '/assets/images/founding-hero-4.jpg',
    '/assets/images/founding-hero.png',
    '/assets/images/get-in-touch-1.png',
    '/assets/images/get-in-touch-2.png',
    '/assets/images/get-in-touch-3.png',
    '/assets/images/get-in-touch-4.png',
    '/assets/images/get-in-touch-5.png',
    '/assets/images/industry_automobile_service_sattion.png',
    '/assets/images/industry_construction_&_engineering_sites.png',
    '/assets/images/industry_healthcare_hospital.png',
    '/assets/images/industry_manufacturing and factories.png',
    '/assets/images/industry_motor_workshop.png',
    '/assets/images/inspection-reporting-1.png',
    '/assets/images/inspection-reporting-2.png',
    '/assets/images/inspection-reporting-3.png',
    '/assets/images/inspection-reporting-modal-hero.png',
    '/assets/images/intelligence-hero.jpeg',
    '/assets/images/inventory-general_inventory.png',
    '/assets/images/inventory-hand_tool_reserve.png',
    '/assets/images/inventory-modal-hero.jpg',
    '/assets/images/inventory-reserve.png',
    '/assets/images/istart_logo.png',
    '/assets/images/item-requisition-carousel-phone.png',
    '/assets/images/low_initial_investment.png',
    '/assets/images/made-in-India-seal.png',
    '/assets/images/master-data-carousel-phone.png',
    '/assets/images/master-data-modal-hero.png',
    '/assets/images/masterdata-brands.png',
    '/assets/images/masterdata-departments.png',
    '/assets/images/masterdata-fuels.png',
    '/assets/images/masterdata-holidays.png',
    '/assets/images/masterdata-inventory.png',
    '/assets/images/masterdata-locations.png',
    '/assets/images/masterdata-tax.png',
    '/assets/images/masterdata-title.png',
    '/assets/images/masterdata-units.png',
    '/assets/images/mesh-hero-bg-2.jpg',
    '/assets/images/mesh-hero-bg-3.jpg',
    '/assets/images/mesh-hero-bg-4.jpg',
    '/assets/images/mesh-hero-bg.jpg',
    '/assets/images/mobile_first_operations.png',
    '/assets/images/msme_ready.png',
    '/assets/images/multi-workplace.png',
    '/assets/images/my-workstation-carousel-phone.png',
    '/assets/images/my_workstation-blends.png',
    '/assets/images/my_workstation-toolbox.png',
    '/assets/images/my_workstation-vehicle.png',
    '/assets/images/my_workstation-workstation.png',
    '/assets/images/newsapphirehero.jpeg',
    '/assets/images/newsapphirehero.png',
    '/assets/images/no_skills.png',
    '/assets/images/office buildings.jpg',
    '/assets/images/purpose-tray-1.jpg',
    '/assets/images/purpose-tray-3.jpg',
    '/assets/images/purpose-tray.jpg',
    '/assets/images/quick_to_implement.png',
    '/assets/images/reports-and-inspection-carousel-phone.png',
    '/assets/images/request-issue_request.png',
    '/assets/images/request-location_change.png',
    '/assets/images/request-modal-hero.png',
    '/assets/images/request-retrun_request.png',
    '/assets/images/request-surrender_request.png',
    '/assets/images/resolution-data_entry.png',
    '/assets/images/resolution-discard.png',
    '/assets/images/resolution-repair.png',
    '/assets/images/resolution-replacement.png',
    '/assets/images/resolution-report-modal-hero.jpg',
    '/assets/images/resolution-report_analysis.png',
    '/assets/images/sapphire_hero_1.jpeg',
    '/assets/images/sapphire_hero_2.jpeg',
    '/assets/images/sapphire_hero_3.jpeg',
    '/assets/images/sapphire_hero_4.jpeg',
    '/assets/images/sapphire_hero_5.jpeg',
    '/assets/images/sapphire_hero_6.png',
    '/assets/images/sapphire_hero_7.png',
    '/assets/images/sapphire_instant_approvals.png',
    '/assets/images/sapphire_live_tracking_and_updates.png',
    '/assets/images/sapphire_on-the-go_inspections.png',
    '/assets/images/sapphire_quick_data_logging.png',
    '/assets/images/sapphire_smart_inventrories.png',
    '/assets/images/sapphirewavehero.jpeg',
    '/assets/images/sapphirewavehero2.jpeg',
    '/assets/images/scorp-logo-favicon.png',
    '/assets/images/scorp-sapphire-cropped.png',
    '/assets/images/service-and-maintenance-carousel-phone.png',
    '/assets/images/service_and_maintenance-data_logging.png',
    '/assets/images/service_and_maintenance-modal-hero.png',
    '/assets/images/service_and_maintenance-repair_&_service.png',
    '/assets/images/service_and_maintenance-set_reminders.png',
    '/assets/images/smart-inventories-carousel-phone.png',
    '/assets/images/smartphoneframe.png',
    '/assets/images/start-up-india-logo.png',
    '/assets/images/sustainable_growth.png',
    '/assets/images/user-management-1.png',
    '/assets/images/user-management-2.jpeg',
    '/assets/images/user-management-4.png',
    '/assets/images/user-management-carousel-phone.png',
    '/assets/images/user-management-user-analytics.png',
    '/assets/images/v859-katie-12.jpg',
    '/assets/images/white_bg-highres.png',
    '/assets/images/white_bg.jpeg',
    '/assets/images/workplace-management-analytics.png',
    '/assets/images/workplace-management-carousel-phone.png',
    '/assets/images/workplace-management-shift-timings.png',
    '/assets/images/workplace_management-Owner_citywide_office.png',
    '/assets/images/workplace_management-citywide_workplaces.png',
    '/assets/images/zero_operational_Complexity.png'
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
