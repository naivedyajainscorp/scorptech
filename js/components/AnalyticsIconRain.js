/* ════════════════════════════════════════════════════════════════════════════
   ANALYTICS ICON RAIN COMPONENT
   ════════════════════════════════════════════════════════════════════════════ */

export function analyticsIconRain(heroId, icons, count, config) {
  const hero = document.getElementById(heroId);
  if (!hero) {
    console.warn(`⚠️ Analytics Icon Rain: Hero "${heroId}" not found`);
    return;
  }

  const defaults = {
    minSize: 2,
    maxSize: 4,
    minDuration: 8,
    maxDuration: 15,
    maxDelay: 5
  };

  const settings = { ...defaults, ...config };
  const iconArray = Array.isArray(icons) ? icons : [icons];

  for (let i = 0; i < count; i++) {
    const randomIcon = iconArray[Math.floor(Math.random() * iconArray.length)];
    const icon = document.createElement('i');
    icon.className = `${randomIcon} analytics-falling-icon`;
    icon.style.left = `${Math.random() * 100}%`;
    icon.style.animationDelay = `${Math.random() * settings.maxDelay}s`;
    icon.style.animationDuration = `${settings.minDuration + Math.random() * (settings.maxDuration - settings.minDuration)}s`;
    icon.style.fontSize = `${settings.minSize + Math.random() * (settings.maxSize - settings.minSize)}rem`;
    hero.appendChild(icon);
  }

  console.log(`✅ Icon rain initialized for "${heroId}" with ${count} icons`);
}
