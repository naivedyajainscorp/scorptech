/**
 * GENERATE WORD FROM SPECIFIC JSON VERSION
 * Usage:
 *   node extract-to-word.js v1
 * Output:
 *   exports/doc/v1/SAPPHIRE_Assessment_Content.docx
 */

const fs = require("fs");
const path = require("path");
const { Document, Packer, Paragraph, HeadingLevel } = require("docx");

const version = process.argv[2];

if (!version || !/^v\d+$/.test(version)) {
    console.log("❌ Please provide a version. Example:");
    console.log("   node extract-to-word.js v1");
    process.exit(1);
}

const jsonPath = path.join(__dirname, "exports", "json", version, "master-assessment.json");

if (!fs.existsSync(jsonPath)) {
    console.log(`❌ Version ${version} not found in exports/json`);
    process.exit(1);
}

const master = JSON.parse(fs.readFileSync(jsonPath, "utf8"));

// Create doc version folder
const docBase = path.join(__dirname, "exports", "doc");
const docVersionFolder = path.join(docBase, version);

if (!fs.existsSync(docBase)) {
    fs.mkdirSync(docBase, { recursive: true });
}

if (!fs.existsSync(docVersionFolder)) {
    fs.mkdirSync(docVersionFolder);
}

// Clean HTML
function stripHTML(html = "") {
    return html.replace(/<[^>]*>/g, "").replace(/\n\s*\n/g, "\n").trim();
}

// Create document
const doc = new Document({
    creator: "Sapphire Extractor",
    title: "SAPPHIRE Assessment Content",
    sections: []
});

master.assessmentSections.forEach(section => {

    const children = [];

    children.push(
        new Paragraph({
            text: section.name,
            heading: HeadingLevel.HEADING_1
        })
    );

    section.questions.forEach(q => {

        children.push(
            new Paragraph({
                text: `Question ID: ${q.id}`,
                heading: HeadingLevel.HEADING_2
            }),
            new Paragraph(`Type: ${q.type}`),
            new Paragraph("Question:"),
            new Paragraph(q.text)
        );

        if (q.hint) {
            children.push(
                new Paragraph({
                    text: "Hint",
                    heading: HeadingLevel.HEADING_3
                }),
                new Paragraph(stripHTML(q.hint))
            );
        }

        children.push(
            new Paragraph({
                text: "Options & Responses",
                heading: HeadingLevel.HEADING_3
            })
        );

        q.options.forEach(opt => {
            children.push(
                new Paragraph({
                    text: `Option: ${opt.label}`,
                    heading: HeadingLevel.HEADING_4
                }),
                new Paragraph(`Value Key: ${opt.value}`),
                new Paragraph("Primary Response:"),
                new Paragraph(opt.primary || "—"),
                new Paragraph("Secondary Response (How Sapphire Helps):"),
                new Paragraph(opt.secondary || "—"),
                new Paragraph("")
            );
        });
    });

    doc.addSection({ children });
});

(async () => {
    const outputPath = path.join(docVersionFolder, "SAPPHIRE_Assessment_Content.docx");

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(outputPath, buffer);

    console.log(`✅ Word generated for version ${version} → exports/doc/${version}`);
})();
