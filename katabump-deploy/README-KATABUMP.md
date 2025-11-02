# KataBump Deployment Guide

This is the automated deployment package for your CrossFire Gaming Blog on KataBump.

## Quick Start

### 1. First Time Setup

```bash
# Make scripts executable
chmod +x setup.sh start.sh

# Run setup (this will create .env and validate configuration)
./setup.sh
```

### 2. Configure Environment

Edit the `.env` file and set your values:

```bash
# Required: MongoDB connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=YourApp

# Required: Generate a secure JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Required: Set a strong admin password
ADMIN_PASSWORD=your_secure_password_here

# Optional: Enable auto-seeding on first run
AUTO_SEED=true
```

### 3. Start the Server

```bash
./start.sh
```

The server will:
- ✅ Automatically connect to MongoDB
- ✅ Auto-seed events and news if enabled
- ✅ Create default admin account
- ✅ Start on port 5000 (or your configured PORT)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net/db` |
| `JWT_SECRET` | Secret key for JWT tokens | Generate with `openssl rand -hex 32` |
| `PORT` | Server port | `5000` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `ADMIN_PASSWORD` | Default admin password | `admin123` (change this!) |
| `AUTO_SEED` | Auto-seed database | `true` |

## MongoDB Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Get your connection string
5. Whitelist your IP or allow access from anywhere (0.0.0.0/0)

## Default Admin Credentials

After first run with `AUTO_SEED=true`:

- **Username**: `admin`
- **Password**: Value from `ADMIN_PASSWORD` in `.env`

⚠️ **Important**: Change the default password immediately in production!

## Features

### Auto-Seeding

When `AUTO_SEED=true`, the server will automatically:

- ✅ Create 5 events with CrossFire tournament data
- ✅ Create 6 news items with latest updates
- ✅ Set up default admin account
- ✅ All images use catbox.moe URLs (no local storage needed)

### Security

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Environment variable validation
- ✅ Secure admin access controls

## Troubleshooting

### Server won't start

```bash
# Check environment configuration
cat .env

# Validate MongoDB connection
# Make sure MONGODB_URI is correct and network access is allowed
```

### Can't login to admin

```bash
# Check admin password in .env
echo $ADMIN_PASSWORD

# Reset database and re-seed
# Set AUTO_SEED=true and restart
```

### MongoDB connection failed

1. Check your MongoDB URI format
2. Verify network access is allowed (IP whitelist)
3. Confirm database user credentials
4. Check if cluster is active

## File Structure

```
katabump-deploy/
├── index.js              # Main server file
├── neon-storage.js       # Storage implementation
├── neon-schema.js        # Database schema
├── .env                  # Environment configuration (create this)
├── .env.example          # Environment template
├── setup.sh              # Setup script
├── start.sh              # Start script
└── README-KATABUMP.md    # This file
```

## Support

For issues or questions:
1. Check the logs when running `./start.sh`
2. Verify all environment variables are set correctly
3. Ensure MongoDB cluster is accessible
4. Check server logs for specific error messages

## Production Checklist

Before deploying to production:

- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Generate secure `JWT_SECRET` using `openssl rand -hex 32`
- [ ] Set `NODE_ENV=production`
- [ ] Verify MongoDB connection string
- [ ] Test admin login functionality
- [ ] Verify events and news are displaying
- [ ] Check that all images load (catbox URLs)
- [ ] Set appropriate MongoDB network access rules
- [ ] Backup database regularly

## Automatic Features

This deployment is designed to work automatically:

- ✅ **No manual console commands needed** - Everything configured through .env
- ✅ **Auto-seeding** - Events and news populated automatically
- ✅ **Catbox image URLs** - No need to upload images
- ✅ **MongoDB validation** - Checks connection on startup
- ✅ **Error handling** - Clear error messages if something goes wrong

Just configure .env and run `./start.sh` - that's it!
