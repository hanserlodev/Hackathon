# 🚀 Deployment Guide for Render

## Prerequisites
- GitHub account
- Render account (free): https://render.com

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Production ready - Deploy to Render"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/meteor-simulator.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → Select **"Web Service"**
3. **Connect GitHub**: Authorize Render to access your repositories
4. **Select Repository**: Choose `meteor-simulator` (or your repo name)
5. **Configure Service**:

```
Name: meteor-impact-simulator
Region: Oregon (US West)
Branch: main
Runtime: Python 3
Build Command: pip install -r requirements.txt
Start Command: gunicorn server:app
Instance Type: Free
```

6. **Environment Variables** (Optional):
```
FLASK_ENV = production
PYTHON_VERSION = 3.11.6
```

7. **Click "Create Web Service"**

### 3. Wait for Deployment

- First deploy takes ~5-10 minutes
- Render will:
  - Install dependencies from `requirements.txt`
  - Start the Flask server with Gunicorn
  - Assign a public URL

### 4. Access Your App

Your app will be available at:
```
https://meteor-impact-simulator.onrender.com
```

Or whatever name you chose during setup.

## 🔧 Configuration Files

### `requirements.txt`
Lists all Python dependencies:
- Flask 3.0.0 (web framework)
- Flask-CORS 4.0.0 (CORS support)
- requests 2.31.0 (HTTP requests)
- gunicorn 21.2.0 (production server)

### `Procfile`
Tells Render how to start the app:
```
web: gunicorn server:app
```

### `runtime.txt`
Specifies Python version:
```
python-3.11.6
```

### `render.yaml`
Blueprint for automatic deployment (optional).

## 🌐 NASA APIs Configuration

All NASA API proxies are configured in `server.py`:

- ✅ **NEO Feed API**: `/api/nasa/neo`
- ✅ **SBDB API**: `/api/sbdb`
- ✅ **SBDB Query API**: `/api/sbdb_query`
- ✅ **Overpass API**: `/overpass`
- ✅ **Geocoding**: `/api/geocoding`

No additional configuration needed - they work out of the box!

## 🔄 Automatic Deployments

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Render automatically detects push and redeploys
```

## 📊 Monitoring

### View Logs
1. Go to Render Dashboard
2. Click your service
3. Click "Logs" tab
4. View real-time application logs

### Check Status
- **Build Status**: Shows if build succeeded
- **Deploy Status**: Shows if deploy is live
- **Health Check**: Render pings your app every minute

## 🐛 Troubleshooting

### Build Fails
- Check `requirements.txt` for correct package versions
- View build logs in Render dashboard
- Ensure `gunicorn` is listed in requirements

### App Won't Start
- Check that `server.py` has the correct structure
- Verify `app` object is named `app` (not `application`)
- Check logs for Python errors

### CORS Errors
- Flask-CORS is enabled globally in `server.py`
- All routes accept cross-origin requests

### NASA APIs Not Working
- All APIs use proxy routes to avoid CORS
- Check if Render IP is not blocked by NASA
- Verify timeout settings (30 seconds for SBDB)

## 💰 Free Tier Limits

Render Free Tier includes:
- ✅ 750 hours/month (enough for 24/7 uptime)
- ✅ 512 MB RAM
- ✅ SSL certificate included
- ✅ Custom domain support
- ⚠️ App sleeps after 15 min of inactivity
- ⚠️ Cold start takes 30 seconds

### Preventing Sleep
Free tier apps sleep, but wake up automatically when accessed. To keep it awake:

1. **Use a monitoring service** (optional):
   - UptimeRobot (free)
   - Pingdom (free tier)
   - Cron-job.org

2. **Set up a ping** every 10 minutes to keep it warm

## 🔐 Security

### Best Practices
- ✅ Debug mode disabled in production
- ✅ CORS configured properly
- ✅ No sensitive data in code
- ✅ Environment variables for secrets
- ✅ .gitignore excludes sensitive files

### Adding Secrets
If you need API keys:
1. Go to Render Dashboard
2. Click your service
3. Go to "Environment" tab
4. Add environment variables
5. Redeploy

## 📈 Upgrading

To upgrade to paid tier:
1. Go to Render Dashboard
2. Click your service
3. Click "Settings"
4. Change instance type to "Starter" ($7/month)

Benefits:
- No sleep
- More RAM
- Faster performance
- Priority support

## 🆘 Support

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **GitHub Issues**: Open issue in your repo

## ✅ Deployment Checklist

Before deploying:
- [ ] All code committed to GitHub
- [ ] `requirements.txt` up to date
- [ ] `Procfile` created
- [ ] `runtime.txt` specifies Python version
- [ ] `.gitignore` excludes unnecessary files
- [ ] `server.py` uses PORT environment variable
- [ ] Debug mode disabled
- [ ] All NASA API routes tested locally

After deploying:
- [ ] App builds successfully
- [ ] App starts without errors
- [ ] Homepage loads correctly
- [ ] Meteorite selector populates
- [ ] Map displays properly
- [ ] Simulation runs successfully
- [ ] NASA APIs respond correctly
- [ ] SBDB integration works
- [ ] Eyes on Asteroids links work

## 🎉 Success!

Your Meteorite Impact Simulator is now live and accessible worldwide!

**Share your deployment:**
- Tweet it: "Check out my meteorite simulator built with NASA data!"
- Add to portfolio
- Share on LinkedIn
- Show to friends and family

**Next steps:**
- Add custom domain (Render supports this for free)
- Monitor usage with Render analytics
- Add more features
- Collect feedback

---

**Deployed with ❤️ using Render**
