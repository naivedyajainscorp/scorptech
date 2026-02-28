/**
 * GENERATE JS FROM SPECIFIC JSON VERSION
 * Usage:
 *   node generate-js-from-master.js v2
 * Output:
 *   exports/js/v2/
 */

const fs = require("fs");
const path = require("path");

const version = process.argv[2];

if (!version || !/^v\d+$/.test(version)) {
    console.log("❌ Please provide a version. Example:");
    console.log("   node generate-js-from-master.js v1");
    process.exit(1);
}

const jsonPath = path.join(__dirname, "exports", "json", version, "master-assessment.json");

if (!fs.existsSync(jsonPath)) {
    console.log(`❌ Version ${version} not found in exports/json`);
    process.exit(1);
}

const master = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

// Create JS version folder
const jsBase = path.join(__dirname, "exports", "js");
const jsVersionFolder = path.join(jsBase, version);

if (!fs.existsSync(jsBase)) {
    fs.mkdirSync(jsBase, { recursive: true });
}

if (!fs.existsSync(jsVersionFolder)) {
    fs.mkdirSync(jsVersionFolder);
}

// ─────────────────────────────────────────────
// Build assessment-data.js
// ─────────────────────────────────────────────

const rebuiltData = `
/**
 * AUTO-GENERATED FILE
 * Source: exports/json/${version}/master-assessment.json
 */

const assessmentData = ${JSON.stringify({
    profileSection: master.profileSection,
    organizationSection: master.organizationSection,
    assessmentSections: master.assessmentSections.map(section => ({
        id: section.id,
        name: section.name,
        description: section.description,
        questions: section.questions.map(q => ({
            id: q.id,
            text: q.text,
            type: q.type,
            subtitle: q.subtitle,
            hint: q.hint,
            options: q.options.map(opt => ({
                value: opt.value,
                label: opt.label,
                score: opt.score
            }))
        }))
    }))
}, null, 2)};

if (typeof window !== "undefined") {
    window.assessmentData = assessmentData;
}
`;

fs.writeFileSync(path.join(jsVersionFolder, "assessment-data.js"), rebuiltData.trim(), "utf8");

// ─────────────────────────────────────────────
// Build assessment-responses.js
// ─────────────────────────────────────────────

const responsesObject = {};

master.assessmentSections.forEach(section => {
    section.questions.forEach(q => {
        q.options.forEach(opt => {
            const key = `${q.id}_${opt.value}`;
            responsesObject[key] = {
                primary: opt.primary || "",
                secondary: opt.secondary || ""
            };
        });
    });
});

const rebuiltResponses = `
/**
 * AUTO-GENERATED FILE
 * Source: exports/json/${version}/master-assessment.json
 */

const ASSESSMENT_RESPONSES = ${JSON.stringify(responsesObject, null, 2)};

if (typeof window !== "undefined") {
    window.ASSESSMENT_RESPONSES = ASSESSMENT_RESPONSES;
}
`;

fs.writeFileSync(path.join(jsVersionFolder, "assessment-responses.js"), rebuiltResponses.trim(), "utf8");

console.log(`✅ JS generated for version ${version} → exports/js/${version}`);
