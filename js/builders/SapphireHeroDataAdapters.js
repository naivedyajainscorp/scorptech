// SapphireHeroDataAdapters.js

const STAGE_BANK_PATH = "../../assets/data/sapphire-hero-stage-bank.json";

const CHAOS_TYPE_META = {
    form: { accent: "warn", label: "Form" },
    event: { accent: "accent", label: "Event" },
    doc: { accent: "accent2", label: "Document" },
    document: { accent: "accent2", label: "Document" },
    email: { accent: "danger", label: "Email" },
    note: { accent: "danger", label: "Note" },
    request: { accent: "warn", label: "Request" }
};

const SAPPHIRE_TYPE_META = {
    record: { accent: "success", label: "Record" },
    work_order: { accent: "success", label: "Work Order" },
    workorder: { accent: "success", label: "Work Order" },
    event_out: { accent: "accent", label: "Auto Event" },
    schedule: { accent: "accent", label: "Scheduled Event" },
    document: { accent: "accent2", label: "Document" },
    doc_out: { accent: "accent2", label: "Document" },
    asset_log: { accent: "success", label: "Asset Log" },
    audit: { accent: "success", label: "Audit Trail" }
};

function asArray(value) {
    if (Array.isArray(value)) return value.filter(Boolean);
    if (value == null) return [];
    return [value].filter(Boolean);
}

function asObject(value) {
    return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function toSlug(value = "") {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function toTitle(value = "") {
    return String(value)
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function safeText(value, fallback = "") {
    if (value == null) return fallback;
    const text = String(value).trim();
    return text || fallback;
}

function normalizeMetric(metric, index = 0) {
    if (metric == null) {
        return { value: "", label: "", suffix: "", key: `metric-${index}` };
    }
    if (typeof metric === "string" || typeof metric === "number") {
        return { value: String(metric), label: "", suffix: "", key: `metric-${index}` };
    }
    const item = asObject(metric);
    return {
        value: safeText(item.value ?? item.number ?? item.count ?? item.amount, ""),
        label: safeText(item.label ?? item.title ?? item.name, ""),
        suffix: safeText(item.suffix, ""),
        key: toSlug(item.key ?? item.label ?? item.title ?? `metric-${index}`)
    };
}

function inferChaosType(item = {}) {
    return toSlug(
        item.type ?? item.kind ?? item.cardType ?? 
        item.inputType ?? item.sourceType ?? item.category ?? "form"
    );
}

function inferSapphireType(item = {}) {
    return toSlug(
        item.type ?? item.kind ?? item.cardType ?? 
        item.outputType ?? item.resultType ?? item.category ?? "record"
    );
}

function normalizeChaosItem(item = {}) {
    const rawType = inferChaosType(item);
    const meta = CHAOS_TYPE_META[rawType] || { accent: "accent", label: toTitle(rawType || "Input") };
    const lines = asArray(item.lines ?? item.placeholders ?? item.bars).slice(0, 3);
    return {
        type: rawType,
        title: safeText(item.title ?? item.label ?? meta.label, meta.label),
        text: safeText(item.text ?? item.value ?? item.description ?? item.subtitle, ""),
        meta: asArray(item.meta ?? item.tags ?? item.tokens).slice(0, 3),
        accent: safeText(item.accent, meta.accent),
        lines: lines.length ? lines : [85, 65, 72],
        raw: item
    };
}

function normalizeSapphireItem(item = {}) {
    const rawType = inferSapphireType(item);
    const meta = SAPPHIRE_TYPE_META[rawType] || { accent: "success", label: toTitle(rawType || "Output") };
    return {
        type: rawType,
        title: safeText(item.title ?? item.label ?? meta.label, meta.label),
        text: safeText(item.text ?? item.value ?? item.description ?? item.subtitle, ""),
        tags: asArray(item.tags ?? item.meta ?? item.tokens).slice(0, 4),
        accent: safeText(item.accent, meta.accent),
        raw: item
    };
}

function normalizePairEntry(entry = {}) {
    const category = safeText(entry.category ?? entry.key ?? entry.slug ?? entry.name, "general");
    return {
        id: safeText(entry.id ?? entry.key ?? category, toSlug(category)),
        category,
        chaos: normalizeChaosItem(entry.chaos ?? entry.input ?? entry.source ?? entry.before ?? entry.left ?? {}),
        sapphire: normalizeSapphireItem(entry.sapphire ?? entry.output ?? entry.result ?? entry.after ?? entry.right ?? {}),
        metrics: asArray(entry.metrics ?? entry.stats ?? entry.kpis).slice(0, 3).map(normalizeMetric),
        raw: entry
    };
}

function extractPairEntries(stageBank) {
    if (Array.isArray(stageBank)) return stageBank.map(normalizePairEntry);
    const root = asObject(stageBank);
    if (Array.isArray(root.pairs)) return root.pairs.map(normalizePairEntry);
    if (Array.isArray(root.items)) return root.items.map(normalizePairEntry);
    if (Array.isArray(root.stages)) return root.stages.map(normalizePairEntry);
    if (Array.isArray(root.cards)) return root.cards.map(normalizePairEntry);
    return [];
}

function extractMetrics(stageBank, pair = null) {
    const root = asObject(stageBank);
    const pairMetrics = asArray(pair?.metrics);
    if (pairMetrics.length) return pairMetrics;
    return asArray(root.metrics ?? root.stats ?? root.kpis).slice(0, 3).map(normalizeMetric);
}

export async function fetchStageBank() {
    const response = await fetch(STAGE_BANK_PATH);
    if (!response.ok) throw new Error(`Failed to load Sapphire hero stage bank: ${response.status}`);
    return response.json();
}

export function pickPair(stageBank, category = null) {
    const pairs = extractPairEntries(stageBank);
    if (!pairs.length) throw new Error("No Sapphire hero pairs found in stage bank.");
    if (!category) return pairs[0];

    const target = toSlug(category);
    const exactMatch = pairs.find((p) => toSlug(p.category) === target) || pairs.find((p) => toSlug(p.id) === target);
    if (exactMatch) return exactMatch;

    const partialMatch = pairs.find((p) => toSlug(p.category).includes(target) || toSlug(p.id).includes(target));
    return partialMatch || pairs[0];
}

export function normalizePair(pair, stageBank = null) {
    const normalized = normalizePairEntry(pair);
    const metrics = stageBank ? extractMetrics(stageBank, normalized) : asArray(normalized.metrics).slice(0, 3).map(normalizeMetric);
    return { id: normalized.id, category: normalized.category, chaos: normalized.chaos, sapphire: normalized.sapphire, metrics, raw: normalized.raw };
}