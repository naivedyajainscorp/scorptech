// SapphireHeroCardBuilders.js

function escapeHtml(value = "") {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function sanitizeClass(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function buildTagRow(tags = []) {
    const safeTags = (Array.isArray(tags) ? tags : []).filter(Boolean).slice(0, 4);
    if (!safeTags.length) return "";

    return `<div class="s-tag-row">${safeTags.map((tag) =>
        `<span class="s-tag">${escapeHtml(tag)}</span>`
    ).join("")}</div>`;
}

function buildMetricCard(metric = {}) {
    return `<div class="s-metric">
        <div class="s-mn">${escapeHtml(`${metric.value ?? ""}${metric.suffix ?? ""}`)}</div>
        <div class="s-ml">${escapeHtml(metric.label ?? "")}</div>
    </div>`;
}

export function buildChaosCard(props = {}, index = 0) {
    const typeClass = sanitizeClass(props.type || "form");
    const title = escapeHtml(props.title || "Input");
    const text = escapeHtml(props.text || "");
    const delay = `${0.1 + index * 0.2}s`;

    return `<div class="s-chaos-card s-${typeClass}" style="animation-delay:${delay}">
        <div class="s-ct">${title}</div>
        <div class="s-cv">${text}</div>
        ${buildTagRow(props.meta || props.tags)}
    </div>`;
}

export function buildSapphireCard(props = {}, index = 0) {
    const rawType = sanitizeClass(props.type || "record");
    let variantClass = "s-record-out";

    if (rawType === "event_out" || rawType === "schedule") {
        variantClass = "s-event-out";
    } else if (rawType === "document" || rawType === "doc_out") {
        variantClass = "s-doc-out";
    } else if (rawType === "work_order" || rawType === "workorder") {
        variantClass = "s-work-out";
    } else if (rawType === "asset_log") {
        variantClass = "s-asset-log-out";
    } else if (rawType === "audit") {
        variantClass = "s-audit-out";
    }

    const title = escapeHtml(props.title || "Output");
    const text = escapeHtml(props.text || "");
    const delay = `${0.9 + index * 0.2}s`;

    return `<div class="s-out-card ${variantClass}" style="animation-delay:${delay}">
        <div class="s-ot">${title}</div>
        <div class="s-ov">${text}</div>
        ${buildTagRow(props.tags)}
    </div>`;
}

export function buildMetricsRow(metrics = []) {
    const items = (Array.isArray(metrics) ? metrics : []).filter(Boolean).slice(0, 3);
    if (!items.length) return "";

    return items.map((metric) => buildMetricCard(metric)).join("");
}

export function renderHeroPair(container, pair = {}) {
    if (!container) return;

    const chaosColumn = container.querySelector("[data-hero-chaos-list]");
    const sapphireColumn = container.querySelector("[data-hero-outcome-list]");
    const metricsRow = container.querySelector("[data-hero-metrics]");

    if (chaosColumn) {
        const chaosItems = Array.isArray(pair.chaos) ? pair.chaos : [pair.chaos].filter(Boolean);
        chaosColumn.innerHTML = chaosItems
            .slice(0, 4)
            .map((item, index) => buildChaosCard(item, index))
            .join("");
    }

    if (sapphireColumn) {
        const sapphireItems = Array.isArray(pair.sapphire) ? pair.sapphire : [pair.sapphire].filter(Boolean);
        sapphireColumn.innerHTML = sapphireItems
            .slice(0, 4)
            .map((item, index) => buildSapphireCard(item, index))
            .join("");
    }

    if (metricsRow) {
        metricsRow.innerHTML = buildMetricsRow(pair.metrics);
    }
}