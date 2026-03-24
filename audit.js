const fs = require('fs');
const path = require('path');

const PAPERS_DIR = '/Users/rafaeldepaz/Ethos/.lineage/corpus/07_papers';

const REQUIRED_H2 = [
    '## Status:',
    '## Purpose',
    '## Source Content',
    '## Target Journals',
    '## Author',
    '## Cryptographic Validation'
];

const REQUIRED_LINKS = [
    '- **Integrity Checksum (SHA-256):**',
    '- **Formal PDF Rendering:**',
    '- **Citation Metadata:**',
    '- **Verification Authority:**'
];

console.log("=== INITIATING LOGOS CORRUPT PARSER ===");
let totalPapers = 0;
let perfectPapers = 0;
const schisms = [];

const dirs = fs.readdirSync(PAPERS_DIR).filter(d => fs.statSync(path.join(PAPERS_DIR, d)).isDirectory() && !d.startsWith('.'));

dirs.forEach(dir => {
    totalPapers++;
    const readmePath = path.join(PAPERS_DIR, dir, 'README.md');

    // Check 1: Does README exist?
    if (!fs.existsSync(readmePath)) {
        schisms.push(`[${dir}] FATAL: Missing README.md entirely.`);
        return;
    }

    const content = fs.readFileSync(readmePath, 'utf-8');
    const lines = content.split('\n');

    const errors = [];

    // Check 2: Headings
    for (const h2 of REQUIRED_H2) {
        if (!content.includes(h2)) {
            // 'Status: ' could have dynamic text, but we check '## Status'
            if (h2 === '## Status:' && !content.includes('## Status')) {
                errors.push(`Missing H2: ## Status`);
            } else if (h2 !== '## Status:') {
                errors.push(`Missing H2: ${h2}`);
            }
        }
    }

    // Check 3: Bibliography and Main Tex presence
    if (!fs.existsSync(path.join(PAPERS_DIR, dir, 'main.tex'))) {
        errors.push('Missing Core: main.tex');
    }
    if (!fs.existsSync(path.join(PAPERS_DIR, dir, 'references.bib'))) {
        errors.push('Missing Core: references.bib');
    }

    // Check 4: Cryptographic Links and formatting
    if (content.includes('## Cryptographic Validation')) {
        let hasChecksum = content.includes('- **Integrity Checksum (SHA-256):**');
        let hasPDF = content.includes('- **Formal PDF Rendering:**');
        let hasBib = content.includes('- **Citation Metadata:**');
        let hasVerify = content.includes('- **Verification Authority:**');

        if (!hasChecksum) errors.push('Missing Link Node: Integrity Checksum (SHA-256)');
        if (!hasPDF) errors.push('Missing Link Node: Formal PDF Rendering');
        if (!hasBib) errors.push('Missing Link Node: Citation Metadata');
        if (!hasVerify) errors.push('Missing Link Node: Verification Authority');

        // Check exact URL formatting for PDF and BIB.
        const expectedPdfStr = `[Download Compiled Node](https://fplz13pathijhgsz.public.blob.vercel-storage.com/research/${dir}.pdf)`;
        const expectedBibStr = `[Extract BibTeX](https://fplz13pathijhgsz.public.blob.vercel-storage.com/research/${dir}.bib)`;

        if (hasPDF && !content.includes(expectedPdfStr)) {
            let actualLine = lines.find(l => l.includes('- **Formal PDF Rendering:**'));
            errors.push('Malformed PDF Link: Expected ' + expectedPdfStr + ' but found ' + actualLine);
        }
        if (hasBib && !content.includes(expectedBibStr)) {
            let actualLine = lines.find(l => l.includes('- **Citation Metadata:**'));
            errors.push('Malformed BibTeX Link: Expected ' + expectedBibStr + ' but found ' + actualLine);
        }
    }

    if (errors.length > 0) {
        schisms.push(`[${dir}] Structural Deviations:\n  ` + errors.join('\n  '));
    } else {
        perfectPapers++;
    }
});

console.log(`\n=== AUDIT RESULTS ===`);
console.log(`Total Nodes Scanned: ${totalPapers}`);
console.log(`Perfect Nodes (1:1 Match): ${perfectPapers}`);
console.log(`Nodes with Schisms: ${schisms.length}`);

if (schisms.length > 0) {
    console.log(`\n--- SCHISM REPORT ---`);
    schisms.forEach(s => console.log(s + '\n'));
} else {
    console.log(`\nAll 11-Principles hold. Substrate is mathematically perfect.`);
}
