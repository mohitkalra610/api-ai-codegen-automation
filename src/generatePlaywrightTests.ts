import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHUNKS_DIR = path.resolve(__dirname, 'swagger-chunks');
const OUTPUT_DIR = path.resolve(__dirname, 'generated-tests');

// System prompt for OpenAI
const systemPrompt = `
You are a code generator for Playwright API tests using TypeScript.

### FORMAT RULES:
- Use 'request.newContext()' and store in 'api' of type 'APIRequestContext'.
- Define BASE_URL as: \`const BASE_URL = process.env.API_HOST_URL as string;\`.
- In beforeAll(), set up 'api = await request.newContext()'; in afterAll(), dispose it.
- Use 'data' for request bodies, not 'body'.
- Always set headers: { 'Content-Type': 'application/json' } in POST/PUT/PATCH.
- Use 'response.status()' correctly.
- Use test.describe() and test() syntax from Playwright.
- Write clean, ready-to-run .spec.ts test code.
- NO markdown or explanations — just the raw TypeScript code.
`;

function sanitize(code: string): string {
    return code.replace(/```(typescript|ts|json)?/g, '').replace(/```/g, '').trim();
}

async function generateTest(swagger: object): Promise<string> {
    const messages = [
        { role: 'system', content: systemPrompt.trim() },
        { role: 'user', content: `Generate Playwright tests for this Swagger schema:\n${JSON.stringify(swagger)}` }
    ];

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages,
        temperature: 0.2
    }, {
        headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    const raw = response.data.choices[0].message.content;
    return sanitize(raw);
}

async function processChunks() {
    if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

    const files = fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const swagger = JSON.parse(fs.readFileSync(path.join(CHUNKS_DIR, file), 'utf-8'));
        console.log(`⏳ Generating test for: ${file}`);

        try {
            const testCode = await generateTest(swagger);
            const fileName = file.replace('-swagger.json', '.spec.ts');
            const outputPath = path.join(OUTPUT_DIR, fileName);
            fs.writeFileSync(outputPath, testCode, 'utf-8');
            console.log(`✅ Saved test: ${fileName}`);
        } catch (error: any) {
            console.error(`❌ Failed for ${file}: ${error.message}`);
        }
    }
}

processChunks();