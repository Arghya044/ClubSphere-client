# Troubleshooting White Screen Issue

If you're seeing a white screen, follow these steps:

## 1. Check Browser Console
Open your browser's developer tools (F12) and check the Console tab for any errors.

## 2. Verify Environment Variables
Make sure you have a `.env` file in the root directory with:
```
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=AIzaSyDcOpQsD6nCzhBGG2tQb6-W2DDeZOon7zE
VITE_FIREBASE_AUTH_DOMAIN=clubsphere-de3d9.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=clubsphere-de3d9
VITE_FIREBASE_STORAGE_BUCKET=clubsphere-de3d9.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1092738222494
VITE_FIREBASE_APP_ID=1:1092738222494:web:dffd6caccec7b1ea146e8f
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Sb57bDmCn5vZn6AJasav6GlbU0zdvhkf2KYROW9VF3QSVTYYqBRqyXWnmQVJkldLybRn6CiK9jiVlvfEY9TeZKi008u9T0xt7
```

## 3. Install Dependencies
Run:
```bash
npm install
```

## 4. Start the Development Server
```bash
npm run dev
```

## 5. Check if Server is Running
Make sure your backend server (index.js) is running on port 5000:
```bash
node index.js
```

## 6. Common Issues

### Issue: "Cannot find module" errors
**Solution:** Delete `node_modules` and `package-lock.json`, then run `npm install` again.

### Issue: Firebase initialization errors
**Solution:** Check that all Firebase environment variables are set correctly in `.env`.

### Issue: CORS errors
**Solution:** Make sure your backend server is running and CORS is enabled.

### Issue: Network errors
**Solution:** Verify `VITE_API_URL` matches your backend server URL.

## 7. Clear Browser Cache
Sometimes cached files cause issues. Try:
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Open in incognito/private mode

## 8. Check Network Tab
In browser DevTools, check the Network tab to see if requests are failing.

## 9. Verify PostCSS Config
Make sure `postcss.config.js` exists and contains:
```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 10. Check Tailwind Config
Verify `tailwind.config.js` is properly configured with DaisyUI.

If the issue persists, check the browser console for specific error messages and share them.

