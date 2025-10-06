# 🚀 Quick Deploy Commands

## Test Locally First
```bash
python test_deployment.py
```

## Deploy to Render

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Add all files
```bash
git add .
```

### 3. Commit changes
```bash
git commit -m "Production ready - Meteor Impact Simulator"
```

### 4. Create GitHub repository
Go to https://github.com/new and create a new repository named `meteor-simulator`

### 5. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/meteor-simulator.git
git branch -M main
git push -u origin main
```

### 6. Deploy on Render
1. Go to https://dashboard.render.com/
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:
   - **Name**: meteor-impact-simulator
   - **Region**: Oregon (US West)
   - **Branch**: main
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
   - **Plan**: Free

5. Click "Create Web Service"

### 7. Done! 🎉
Your app will be live at:
```
https://meteor-impact-simulator.onrender.com
```

## Quick Update After Changes
```bash
git add .
git commit -m "Update features"
git push origin main
```
Render will automatically redeploy!

## Files Created for Deployment
- ✅ `requirements.txt` - Python dependencies
- ✅ `Procfile` - Tells Render how to start app
- ✅ `runtime.txt` - Python version
- ✅ `render.yaml` - Render configuration
- ✅ `.gitignore` - Excludes unnecessary files
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `test_deployment.py` - Test before deploying

## Troubleshooting

### Server won't start locally
```bash
pip install -r requirements.txt
python server.py
```

### Build fails on Render
- Check build logs in Render dashboard
- Verify requirements.txt has all dependencies
- Ensure Python version in runtime.txt is supported

### NASA APIs not working
- Check CORS settings (already configured)
- Verify internet connection
- Check API status at https://api.nasa.gov

## Support
See full guide: [DEPLOYMENT.md](DEPLOYMENT.md)
