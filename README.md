# 🔥 API AI Codegen Automation

This tool is an OpenAI-powered test generator that converts any OpenAPI (Swagger) JSON file into comprehensive, production-grade **Playwright API test cases** — automatically.

---

## 🚀 Features

- ✅ Accepts Swagger/OpenAPI 3.0+ JSON input
- ✅ Automatically generates `.spec.ts` test files
- ✅ Uses `@playwright/test` with `APIRequestContext` for proper API testing
- ✅ Groups tests by endpoint using `test.describe()`
- ✅ Fully typed (TypeScript)
- ✅ Built-in support for OpenAI GPT-4
- ✅ No markdown or boilerplate in output

---

## 📦 Installation

```bash
npm install
---



## 📦 Usage
```bash
npx ts-node src/index.ts examples/example-swagger.json