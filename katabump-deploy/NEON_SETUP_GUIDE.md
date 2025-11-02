# KataBump Backend - Neon PostgreSQL Setup Guide

## Step 1: Run SQL in Neon SQL Editor

1. Go to your Neon dashboard at https://console.neon.tech/
2. Open the **SQL Editor** for your database
3. Copy the entire content from `../MIGRATION_SQL.sql`
4. Run the script to create all tables

## Step 2: Get Your Neon Connection String

1. In Neon dashboard, go to **Connection Details**
2. Copy the **Connection String** (it looks like: `postgresql://user:password@host/database?sslmode=require`)
3. Save this - you'll need it for the environment variable

## Step 3: Set Environment Variable

In your KataBump hosting panel, add this environment variable:

```
DATABASE_URL=postgresql://your-user:your-password@your-host.neon.tech/your-database?sslmode=require
```

**Important:** Replace with your actual Neon connection string from Step 2.

## Step 4: Update Your Deployment Files

You need to rebuild your `index.js` with the PostgreSQL version. 

### Option A: Rebuild from source
If you have the source TypeScript files:

1. Replace MongoDB imports with Drizzle/Neon
2. Run: `npm run build`
3. Deploy the new `dist/index.js`

### Option B: Use the provided files
I've created these files for you in the parent directory:
- `NEON_STORAGE.js` - PostgreSQL storage implementation
- `NEON_DB.js` - Database connection

You can either:
1. Integrate these into your source and rebuild
2. Or contact me to help with the full migration

## Step 5: Restart Your Server

After setting the `DATABASE_URL` environment variable and updating your code, restart your KataBump server.

## Troubleshooting

**Error: "MONGODB_URI environment variable is not defined"**
- Solution: Make sure you've rebuilt the code to use PostgreSQL instead of MongoDB

**Error: "Connection refused"**
- Solution: Check that your `DATABASE_URL` is correct and includes `?sslmode=require`

**Tables not found**
- Solution: Make sure you ran the SQL script from Step 1
