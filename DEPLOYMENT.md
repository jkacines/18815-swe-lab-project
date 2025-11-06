# Heroku Deployment Guide

This guide will help you deploy your Flask + React application to Heroku.

## Prerequisites

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Create a Heroku account: https://signup.heroku.com/
3. Install Git (if not already installed)

## Deployment Steps

### 1. Login to Heroku

Open your terminal and run:

```bash
heroku login
```

This will open a browser window for you to log in to your Heroku account.

### 2. Create a New Heroku App

In your project root directory, run:

```bash
heroku create your-app-name
```

Replace `your-app-name` with your desired application name. If you leave it blank, Heroku will generate a random name.

### 3. Verify Git Repository

Make sure you're in a git repository. If not, initialize it:

```bash
git init
git add .
git commit -m "Initial commit for Heroku deployment"
```

### 4. Set Environment Variables (if needed)

If you have any environment variables (API keys, database URLs, etc.), set them using:

```bash
heroku config:set VARIABLE_NAME=value
```

For example, if you want to move your MongoDB URI to an environment variable (recommended):

```bash
heroku config:set MONGODB_URI="your-mongodb-connection-string"
```

### 5. Deploy to Heroku

Push your code to Heroku:

```bash
git push heroku main
```

If your main branch is named differently (e.g., `master`), use:

```bash
git push heroku master
```

### 6. Scale Your Dyno

Ensure at least one instance of your app is running:

```bash
heroku ps:scale web=1
```

### 7. Open Your Application

```bash
heroku open
```

This will open your deployed application in a browser.

## Important Files Created

1. **Procfile** - Tells Heroku how to run your app
   - Uses `gunicorn` to serve your Flask application
   - Points to `server/app.py`

2. **requirements.txt** - Lists all Python dependencies
   - Added `gunicorn` for production server

3. **runtime.txt** - Specifies Python version (3.11.9)
   - Note: Python 3.13 is not yet supported by Heroku

4. **.slugignore** - Files to exclude from deployment
   - Excludes client folder and markdown files to reduce slug size

## Troubleshooting

### View Logs

If something goes wrong, check the logs:

```bash
heroku logs --tail
```

### Common Issues

1. **Application Error**: Check logs for Python errors
2. **Port Binding**: Make sure your app listens on `0.0.0.0` and uses the `PORT` environment variable
3. **Dependencies**: Ensure all dependencies are in `requirements.txt`

### Restart Your App

```bash
heroku restart
```

## Next Steps for Production

1. **Move MongoDB URI to Environment Variable**: 
   - Don't hardcode credentials in `app.py`
   - Update `app.py` to use: `os.environ.get('MONGODB_URI')`

2. **Frontend Deployment**:
   - The current setup only deploys the backend
   - To serve the React frontend, you have two options:
     
     **Option A: Separate Frontend Deployment**
     - Deploy frontend to Netlify, Vercel, or another Heroku app
     - Update API calls to use your Heroku backend URL
     
     **Option B: Serve Frontend from Flask**
     - Build the React app: `cd client && npm run build`
     - Configure Flask to serve the built files
     - Add build files to deployment

3. **Enable SSL**: Heroku provides free SSL for your app

4. **Set up a Custom Domain** (optional):
   ```bash
   heroku domains:add www.yourdomain.com
   ```

## Configuration Updates Needed

### For Frontend to Connect to Backend

Update your React app to use the Heroku backend URL:

1. Create a `.env` file in the `client` folder:
   ```
   REACT_APP_API_URL=https://your-app-name.herokuapp.com
   ```

2. Update API calls to use `process.env.REACT_APP_API_URL` instead of localhost

3. Remove or update the `proxy` setting in `client/package.json` for production

## Monitoring

- **View app info**: `heroku info`
- **Check running processes**: `heroku ps`
- **Monitor metrics**: Visit https://dashboard.heroku.com and select your app

## Scaling (if needed)

To scale your app to multiple dynos:

```bash
heroku ps:scale web=2
```

Note: Free tier only allows 1 dyno. Scaling requires a paid plan.
