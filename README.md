# Sadayappan Welfare Trust Website

Public launch links:

- Live site: `https://sadayappanwelfaretrust-dotcom.github.io/swt-test/`
- Repository: `https://github.com/sadayappanwelfaretrust-dotcom/swt-test`

Static bilingual website for Sadayappan Welfare Trust.

## Structure

- `index.html` - home page
- `about.html` - trust story and values
- `programs.html` - program overview
- `donate.html` - donation enquiry page
- `contact.html` - contact and volunteer enquiry page
- `thanks.html` - confirmation page after a successful form submission
- `assets/css/styles.css` - shared styles
- `assets/js/script.js` - shared interactions
- `assets/images/social-preview.png` - social sharing preview image
- `robots.txt` - crawler guidance
- `sitemap.xml` - sitemap for search engines

## Local Preview

You can serve the site with any static server. Example:

```powershell
python -m http.server 4173
```

Then open:

`http://127.0.0.1:4173/`

## Deployment

This project is ready for static hosting on platforms such as:

- Netlify
- Vercel
- GitHub Pages
- cPanel shared hosting
- Any standard web root / public HTML folder

Upload the full folder contents as-is so the HTML files stay at the root and the shared assets remain under `assets/`.

## GitHub Pages

This repository is now prepared for GitHub Pages with:

- `.github/workflows/deploy-pages.yml` for automatic deployment
- `.nojekyll` so GitHub Pages serves the site as plain static files
- `404.html` for a branded not-found page

### Recommended publish flow

1. Create a GitHub repository and push this full folder to it.
2. Make sure your default branch is `main` or `master`.
3. In GitHub, open `Settings -> Pages`.
4. Under `Source`, choose `GitHub Actions`.
5. Push to `main` or `master` and GitHub will deploy automatically using the workflow.

Your GitHub Pages URL will typically be:

- `https://<username>.github.io/<repository>/`

Because the site uses relative links, it works for both:

- a project site such as `username.github.io/repository`
- a user site such as `username.github.io`

### Optional after the repo exists

- Add a `CNAME` file if you want a custom domain.
- Add `sitemap.xml` once the final public URL is known.

## Forms

The donation and contact forms now submit automatically through FormSubmit's standard hosted backend:

- `https://formsubmit.co/sadayappanwelfaretrust@gmail.com`

Production notes:

1. The site keeps FormSubmit reCAPTCHA enabled by default.
2. Both forms include a honeypot field and basic spam blacklist phrases.
3. Successful submissions return visitors to `thanks.html`.
4. If FormSubmit has not already been activated for this inbox, the first real submission may trigger an activation email.
5. If you later move to your own backend or a platform like Netlify/Vercel with server functions, the forms can be upgraded again without redesigning the pages.
