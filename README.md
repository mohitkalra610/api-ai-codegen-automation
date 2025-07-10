# 🧪 Swagger-to-Playwright API Test Generator

This tool automatically generates **Playwright-based API test cases** in **TypeScript** using your OpenAPI (Swagger) specification and the OpenAI GPT API.

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd <your-project-folder>
npm install
```

Ensure:
- Node.js ≥ 18 is installed
- You have a valid [OpenAI API Key](https://platform.openai.com/account/api-keys)

---

## 📁 Project Structure

```
.
├── example/
│   └── example-swagger.json        # Your input Swagger file
├── src/
│   ├── swagger-chunks/             # Auto-generated Swagger chunks
│   ├── generated-tests/            # Final Playwright test files
│   ├── chunkSwaggerByTags.ts       # Script to split Swagger by tags
│   └── generatePlaywrightTests.ts  # Script to generate test cases
├── .env                            # Secrets and config
```

---

## ⚙️ Configuration

Create a `.env` file in the root:

```env
OPENAI_API_KEY=your-openai-api-key
API_HOST_URL=https://your-api-base-url.com
```

---

## 📥 Step 1: Add Your Swagger File

Place your Swagger JSON file inside the `example/` folder.

Example:
```
example/example-swagger.json
```

You can change the file path in `chunkSwaggerByTags.ts`:
```ts
const swaggerFilePath = './example/example-swagger.json';
```

---

## 🪓 Step 2: Chunk the Swagger

Run this to split the Swagger by top-level tags or path segments.

```bash
npx ts-node src/chunkSwaggerByTags.ts
```

✅ Result: Chunked files saved in `src/swagger-chunks/`

---

## 🤖 Step 3: Generate Playwright Tests (via OpenAI)

```bash
npx ts-node src/generatePlaywrightTests.ts
```

This reads from `src/swagger-chunks/` and outputs `.spec.ts` files to `src/generated-tests/`.

**By default, it processes the first 2 chunks**.  
To change this, update the `limit` in the `processChunks()` function inside `generatePlaywrightTests.ts`.

---

## 🧪 Running the Generated Tests

```bash
npx playwright test src/generated-tests
```

Or run specific tests:

```bash
npx playwright test src/generated-tests/comments.spec.ts
```

---

## ✅ Output Example

```ts
import { test, expect, request, APIRequestContext } from '@playwright/test';

let api: APIRequestContext;
const BASE_URL = process.env.API_HOST_URL as string;

test.beforeAll(async () => {
  api = await request.newContext();
});

test.afterAll(async () => {
  await api.dispose();
});

test.describe('comments API', () => {
  test('should delete a comment', async () => {
    const response = await api.delete(`${BASE_URL}/comments?comment_id=1&version_number=1`);
    expect(response.status()).toBe(200);
  });
});
```

---

## ✏️ Notes

- Sample data in POST/PUT tests will need to be filled manually.
- Patch logic ensures consistent formatting, imports, and lifecycle usage in all files.
- Customize the system prompt in `generatePlaywrightTests.ts` if needed.

---

## 💬 Feedback / Contribution

PRs and suggestions welcome!