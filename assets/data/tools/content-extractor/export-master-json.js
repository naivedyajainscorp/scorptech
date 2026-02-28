/**
 * EXPORT MASTER JSON (Versioned)
 * Creates: exports/json/vN/master-assessment.json
 */

const fs = require("fs");
const path = require("path");

// ─────────────────────────────────────────────
// SAFE JS LOADER
// ─────────────────────────────────────────────

function loadJSObject(filePath, exportName) {
    const code = fs.readFileSync(filePath, "utf8");

    const sandbox = {
        window: {},
        document: {},
        console: console
    };

    const wrapped = `
        (function(window, document){
            ${code}
            return ${exportName};
        })(sandbox.window, sandbox.document);
    `;

    return eval(wrapped);
}

// Source JS files
const assessmentData = loadJSObject("../../assessment-data.js", "assessmentData");
const RESPONSES = loadJSObject("../../assessment-responses.js", "ASSESSMENT_RESPONSES");

// ─────────────────────────────────────────────
// Determine next version
// ─────────────────────────────────────────────

const exportBase = path.join(__dirname, "exports", "json");

if (!fs.existsSync(exportBase)) {
    fs.mkdirSync(exportBase, { recursive: true });
}

const existing = fs.readdirSync(exportBase)
    .filter(name => /^v\d+$/.test(name))
    .map(name => parseInt(name.replace("v", "")));

const nextVersion = existing.length ? Math.max(...existing) + 1 : 1;
const versionFolder = path.join(exportBase, `v${nextVersion}`);

fs.mkdirSync(versionFolder);

// ─────────────────────────────────────────────
// Build master object
// ─────────────────────────────────────────────

const master = {
    profileSection: assessmentData.profileSection || null,
    organizationSection: assessmentData.organizationSection || null,
    assessmentSections: []
};

assessmentData.assessmentSections.forEach(section => {

    const sectionObj = {
        id: section.id,
        name: section.name,
        description: section.description || "",
        questions: []
    };

    section.questions.forEach(question => {

        const questionObj = {
            id: question.id,
            text: question.text,
            type: question.type,
            subtitle: question.subtitle || "",
            hint: question.hint || "",
            options: []
        };

        question.options.forEach(option => {

            const responseKey = `${question.id}_${option.value}`;
            const response = RESPONSES[responseKey] || {};

            questionObj.options.push({
                value: option.value,
                label: option.label,
                score: option.score ?? null,
                primary: response.primary || "",
                secondary: response.secondary || ""
            });
        });

        sectionObj.questions.push(questionObj);
    });

    master.assessmentSections.push(sectionObj);
});

// Save file
const outputPath = path.join(versionFolder, "master-assessment.json");

fs.writeFileSync(outputPath, JSON.stringify(master, null, 2), "utf8");

console.log(`✅ MASTER JSON exported to: exports/json/v${nextVersion}`);
