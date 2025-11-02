# Bimora Backend Deployment for Katabump.com

This folder contains all the files needed to deploy your backend to katabump.com.

## 📦 Contents

- `dist/` - Compiled backend server and frontend static files
- `package.json` - Node.js dependencies list
- `package-lock.json` - Locked dependency versions
- `attached_assets/` - Images and static assets

## 🚀 Deployment Steps

### 1. Upload Files to Katabump

Upload this entire folder to your katabump.com server.

### 2. Install Dependencies

SSH into your katabump server and run:

```bash
cd /path/to/your/app
npm install --production
```

This will install all required packages (about 425MB).

### 3. Set Environment Variables

Create a `.env` file or set these environment variables on katabump:

```bash
MONGODB_URI=mongodb+srv://ahmed12ahmed12222_db_user:XQrHohCTcVjBgEbT@cluster0.oq5zwzt.mongodb.net/?retryWrites=true&w=majority
NODE_ENV=production
PORT=5000
JWT_SECRET=your-super-secret-random-string-here-change-this
```

**Important:** Change `JWT_SECRET` to a random secure string!

### 4. Start the Server

#### Option A: Direct Start
```bash
node dist/index.js
```

#### Option B: PM2 (Recommended for Production)
```bash
# Install PM2 globally
npm install -g pm2

# Start the app
pm2 start dist/index.js --name bimora-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on server reboot
pm2 startup
```

### 5. Verify Backend is Running

Visit: `http://your-katabump-url:5000/api/news`

You should see a JSON array of news items.

## 🔧 Common PM2 Commands

```bash
pm2 status              # Check app status
pm2 logs bimora-backend # View logs
pm2 restart bimora-backend # Restart app
pm2 stop bimora-backend    # Stop app
pm2 delete bimora-backend  # Remove app from PM2
```

## 🌐 Next Steps

After your backend is running on katabump:

1. Note your backend URL (e.g., `https://your-app.katabump.com`)
2. Update Netlify configuration to point to this backend URL
3. Deploy frontend to Netlify

## ⚠️ Important Notes

- Make sure MongoDB connection string is correct
- Your MongoDB has been seeded with sample news and events data
- Admin accounts created: mostafa, bavly, highway (check passwords in seed script)
- Port 5000 must be accessible on your katabump server

## 🆘 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check logs: `pm2 logs bimora-backend`

### Can't connect to backend
- Check firewall rules on katabump
- Verify port 5000 is open
- Check server logs for errors

### Frontend can't reach backend
- Update CORS settings if frontend and backend are on different domains
- Update Netlify redirects to point to correct backend URL
