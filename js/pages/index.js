import { initBackground } from '../components/fog_bg.js';

// Initialize background on page load
document.addEventListener('DOMContentLoaded', () => {
  // ════════════════════════════════════════════════════════════
  // OPTION 1: Static fog (single preset, no showcase)
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'BLUE',
  //   mood: 'SAPPHIRE',
  //   blur: 0.65,    // MEDIUM
  //   pace: 0.7,     // SLOW
  //   zoom: 0.85     // NORMAL
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 2: Showcase ALL tones & moods (WHITE excluded)
  //              with smooth 1-second bleed transitions
  // ════════════════════════════════════════════════════════════
  const homeHero = document.querySelector('#homeHero');
  if (homeHero) {
    initBackground('#homeHero', 'fog', {
      tone: 'BLUE',            // Starting preset
      mood: 'SAPPHIRE',
      blur: 0.65,
      pace: 1.2,
      zoom: 0.85,
      showcase: true,          // Enable showcase mode
      showcaseDuration: 1000,  // 5 seconds per preset
      showcaseTransition: 2500, // 1 second smooth bleed
    });
  }

  // ════════════════════════════════════════════════════════════
  // OPTION 3: Showcase only BLUE tone moods
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'BLUE',
  //   mood: 'SAPPHIRE',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseTone: 'BLUE',  // Only cycle BLUE moods
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 4: Showcase only PURPLE tone moods
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'PURPLE',
  //   mood: 'NEBULA',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseTone: 'PURPLE',  // Only cycle PURPLE moods
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 5: Showcase only WARM tone moods
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'WARM',
  //   mood: 'AMBER',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseTone: 'WARM',  // Only cycle WARM moods
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 6: Showcase only MIXED tone moods
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'MIXED',
  //   mood: 'AURORA',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseTone: 'MIXED',  // Only cycle MIXED moods
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 7: Showcase including WHITE tone (all tones)
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'WHITE',
  //   mood: 'PEARL',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseExclude: [],  // Include WHITE tone
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 8: Showcase WHITE tone moods only
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'WHITE',
  //   mood: 'PEARL',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseTone: 'WHITE',  // Only cycle WHITE moods
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 9: Faster transitions (500ms bleed)
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'BLUE',
  //   mood: 'SAPPHIRE',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseDuration: 3000,   // 3 seconds per preset
  //   showcaseTransition: 500,  // Faster 0.5s bleed
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 10: Slower, more dramatic transitions (2s bleed)
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'BLUE',
  //   mood: 'SAPPHIRE',
  //   blur: 0.65,
  //   pace: 0.7,
  //   zoom: 0.85,
  //   showcase: true,
  //   showcaseDuration: 8000,   // 8 seconds per preset
  //   showcaseTransition: 2000, // Dramatic 2s bleed
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 11: Ultra subtle - slow pace, heavy blur
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'WHITE',
  //   mood: 'MIST',
  //   blur: 0.78,    // HEAVY - very soft
  //   pace: 0.3,     // STILL - minimal movement
  //   zoom: 1.0,     // FAR - distant view
  //   showcase: true,
  //   showcaseTone: 'WHITE',
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 12: High energy - fast pace, sharp blur
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'fog', {
  //   tone: 'BLUE',
  //   mood: 'OCEAN',
  //   blur: 0.3,     // SHARP - defined edges
  //   pace: 2.0,     // FAST - quick movement
  //   zoom: 0.6,     // CLOSE - intimate view
  //   showcase: true,
  //   showcaseTone: 'BLUE',
  // });

  // ════════════════════════════════════════════════════════════
  // OPTION 13: Net background (alternative to fog)
  // ════════════════════════════════════════════════════════════
  // initBackground('#homeHero', 'net', {
  //   bandwidth: 'ICE',
  //   pattern: 'OSCILLATE',
  //   harmony: 'MONO',
  //   style: 'WHITE_ON_BLUE'
  // });
});

console.log('✅ Index page fully initialized');
