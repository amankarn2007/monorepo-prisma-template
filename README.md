## 🚀 Ultimate Monorepo Prisma Boilerplate
This is a high-performance, scalable monorepo setup using Turborepo, Prisma, Express, and TypeScript. It is designed to solve common "Module Not Found" and "rootDir" issues that developers face in complex workspace structures.

## 🏗 Project Architectureapps
    * /backend: Express.js server (The API).
    * packages/db: Centralized database logic (Prisma Client + Database Driver).
    * packages/typescript-config: Shared TS configurations.
    
# 🛠 Step-by-Step Setup Guide1. 
    Initialize the Workspace
    Run the following command to create a fresh Turborepo project
    **npx create-turbo@latest**
    Select pnpm or bun as the package manager.Clear the default apps and packages folders if you want a fresh start.
    
# 2. Setup the Database Package (@repo/db)Go to packages/db and initialize Prisma:Bashcd packages/db
    ` pnpm init `
    ` pnpm add @prisma/client pg dotenv `
    ` pnpm add -D prisma @types/pg @types/node typescript `
    ` pnpm exec prisma init `

## Critical Config: schema.prisma
    To avoid rootDir errors, generate the client inside the src folder:
    **generator client {
        provider = "prisma-client-js"
        output   = "../src/generated/prisma" 
    }**

### Database Entry Point: src/index.ts
This file exports a single prismaClient instance to be used by all apps.

  * import { PrismaPg } from '@prisma/adapter-pg'
    import pg from 'pg'
    import dotenv from 'dotenv'
    import { dirname, resolve } from 'path'
    import { fileURLToPath } from 'url'
    import { PrismaClient } from './generated/prisma/index.js'

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    dotenv.config({ path: resolve(__dirname, '../.env') })

    const connectionString = process.env.DATABASE_URL;

    if (!connectionString || connectionString === "undefined") {
        console.error("ERROR: DATABASE_URL is undefined. Check your .env path!");
    }

    const pool = new pg.Pool({ connectionString })
    const adapter = new PrismaPg(pool) 

    export const prismaClient = new PrismaClient({ adapter }) *


# 3. Setup the Backend App (apps/backend).     (cd apps/backend)
    pnpm init
    pnpm add express @repo/db@workspace:*
    pnpm add -D tsx typescript @types/express


### Server Entry Point: src/server.tsTypeScriptimport express from "express";
    import { prismaClient } from "@repo/db/client";

    const app = express();
    app.use(express.json());

    app.get("/users", async (req, res) => {
        const users = await prismaClient.user.findMany();
        res.json({ users });
    });

    app.listen(3001, () => console.log("Server running on port 3001"));

### 📦 Package Breakdown1. 
    @repo/db (The Engine)
        @prisma/client: The core runtime for queries.
        pg & @prisma/adapter-pg: The driver that lets Prisma talk to PostgreSQL.
        dotenv: Essential for loading DATABASE_URL from the .env file.
        @types/node: Required so TypeScript understands process.env and path.
        
    2. apps/backend (The Brain)
        tsx: The development runner. It executes .ts files directly without waiting for a build.
        express: The web framework for handling HTTP requests.
        @repo/db: Imported via workspace to allow type-safe DB access.