# Sadayappan Welfare Trust Website

Static bilingual website for Sadayappan Welfare Trust.

## Structure

- `index.html` - home page
- `about.html` - trust story and values
- `programs.html` - program overview
- `donate.html` - donation enquiry page
- `contact.html` - contact and volunteer enquiry page
- `assets/css/styles.css` - shared styles
- `assets/js/script.js` - shared interactions
- `robots.txt` - crawler guidance

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

The donation and contact forms currently use FormSubmit:

- `https://formsubmit.co/ssadayap@gmail.com`
- `https://formsubmit.co/ajax/ssadayap@gmail.com`

Before going live:

1. Submit one test form.
2. Complete the FormSubmit email activation if prompted.
3. Replace the destination email if the trust wants submissions sent elsewhere.
4. If you later get Razorpay, UPI QR, or bank details, the donation page can be upgraded to direct payment collection.
