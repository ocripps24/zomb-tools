# GSAP Setup Instructions

This project uses GSAP with Club GreenSock premium plugins (ScrollSmoother, etc.).

## First-Time Setup

### 1. Get Your GSAP Token

1. Go to https://greensock.com/
2. Sign in to your Club GreenSock account
3. Navigate to your account dashboard
4. Find your "Private NPM Token"
5. Copy the token

### 2. Create Local .npmrc File

```bash
# Copy the example file
cp .npmrc.example .npmrc
```

Then open `.npmrc` and replace `YOUR_GSAP_TOKEN_HERE` with your actual GSAP token.

**IMPORTANT**:
- `.npmrc` is already in `.gitignore` and will NOT be committed to the repo
- Never commit your token to version control
- Each team member needs to create their own `.npmrc` file

### 3. Install Dependencies

```bash
npm install
```

This will install GSAP and all premium plugins from the private registry.

## For CI/CD / GitHub Actions

If you need to build this project in CI/CD:

1. Add your GSAP token as a **GitHub Repository Secret**:
   - Go to your repo on GitHub
   - Click **Settings** (repo settings, not your personal settings)
   - In the left sidebar, click **Secrets and variables** → **Actions**
   - Click the **Secrets** tab (should be selected by default)
   - Click **New repository secret** button
   - Name: `GSAP_AUTH_TOKEN`
   - Secret: Your GSAP token from https://greensock.com/account/
   - Click **Add secret**

   **Note**: Use **Repository secrets**, not Environment secrets. Repository secrets are available to all workflows in the repo.

2. Add to your GitHub Actions workflow (e.g., `.github/workflows/deploy.yml`):
   ```yaml
   - name: Setup GSAP Token
     run: |
       echo "@gsap:registry=https://npm.greensock.com" >> .npmrc
       echo "//npm.greensock.com/:_authToken=${{ secrets.GSAP_AUTH_TOKEN }}" >> .npmrc

   - name: Install dependencies
     run: npm install
   ```

## Troubleshooting

### "401 Unauthorized" when installing
- Check that your `.npmrc` file exists
- Verify your token is correct
- Make sure the token hasn't expired

### GSAP not found
- Run `npm list gsap` to check installation
- Try `rm -rf node_modules package-lock.json && npm install`

### Token expired
- Get a new token from https://greensock.com/account/
- Update your `.npmrc` file with the new token
- Run `npm install` again

## What's Included

With your Club GreenSock membership, you get:

- **Core GSAP**: Full animation library
- **ScrollTrigger**: Scroll-based animations
- **ScrollSmoother**: Buttery smooth scrolling
- **Draggable**: Drag and drop functionality
- **MorphSVG**: SVG morphing animations
- **SplitText**: Text animation effects
- **And more**: All premium plugins!

## Security

- ✅ `.npmrc` is in `.gitignore`
- ✅ `.npmrc.example` is safe to commit (no token)
- ✅ Token never appears in code or logs
- ⚠️ Never hardcode the token anywhere
- ⚠️ Never commit `.npmrc` file

## Questions?

- GSAP Docs: https://greensock.com/docs/
- GSAP Forums: https://greensock.com/forums/
- React Guide: https://greensock.com/react/
