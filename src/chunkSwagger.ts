import * as fs from 'fs';
import * as path from 'path';

// Types
type SwaggerPaths = {
    [path: string]: { [method: string]: any };
};

type Swagger = {
    openapi: string;
    info: {
        title: string;
        version: string;
    };
    paths: SwaggerPaths;
};

// Generate dynamic nested group keys
function generateGroupKey(path: string): string {
    const segments = path.split('/').filter(Boolean); // removes empty segments
    if (segments.length === 0) return 'root';
    if (segments.length === 1) return segments[0];
    return `${segments[0]}.${segments[1].replace(/[{}]/g, '')}`;
}

// Split Swagger paths into dynamic nested groups
function splitSwaggerPathsByNestedGroup(swagger: Swagger): { [group: string]: SwaggerPaths } {
    const groups: { [group: string]: SwaggerPaths } = {};

    Object.keys(swagger.paths).forEach((path) => {
        const group = generateGroupKey(path);
        if (!groups[group]) groups[group] = {};
        groups[group][path] = swagger.paths[path];
    });

    return groups;
}

// Save grouped Swagger chunks
async function saveSwaggerGroups(groups: { [group: string]: SwaggerPaths }) {
    const directory = path.resolve(__dirname, 'swagger-chunks');

    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }

    for (const [group, paths] of Object.entries(groups)) {
        const filePath = path.join(directory, `${group}-swagger.json`);
        const swaggerData = {
            openapi: "3.0.0",
            info: {
                title: `${group} API`,
                version: "1.0.0"
            },
            paths: paths
        };
        fs.writeFileSync(filePath, JSON.stringify(swaggerData, null, 2), 'utf-8');
        console.log(`Saved ${group} API to ${filePath}`);
    }
}

// Main execution
async function splitAndSaveSwagger(swaggerFilePath: string) {
    const swaggerData: Swagger = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));
    const groups = splitSwaggerPathsByNestedGroup(swaggerData);
    await saveSwaggerGroups(groups);
}

// Run the splitter with your file
const swaggerFilePath = './example/mapuna-swagger.json'; // Adjust if needed
splitAndSaveSwagger(swaggerFilePath).catch(console.error);