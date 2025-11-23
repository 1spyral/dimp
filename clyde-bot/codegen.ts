import type { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
    schema: "../clyde-server/schema.graphql",

    documents: "src/**/*.ts",

    generates: {
        "src/graphql/generated.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-graphql-request",
            ],
        },
    },

    ignoreNoDocuments: true,
}

export default config
