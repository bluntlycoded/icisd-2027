# ICISD'27 website

Redesigned site for the 6th International Conference on Innovation & Sustainable Business Practices in the Digital Era (ICISD'27), 29–30 January 2027, VIT-AP School of Business.

Static HTML/CSS/JS, no build step. Open `index.html` or serve the folder:

```bash
python3 -m http.server 8000
```

- `index.html` — all content (single page)
- `assets/css/styles.css` — design tokens at the top (`:root`)
- `assets/js/main.js` — countdown, timeline status, nav, scroll reveal

Bump the `?v=` on the CSS/JS links in `index.html` after editing so browsers fetch the new files.
