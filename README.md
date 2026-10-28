# JST CRM Runbook

Source of the runbook site (MkDocs Material).

```bash
pip install -r requirements.txt
mkdocs serve        # preview at http://127.0.0.1:8000
```

Push to `main` and the Docs workflow publishes to GitHub Pages
(Settings → Pages → source: `gh-pages` branch).
Every page follows the same shape: When to use → Steps → Check → If it fails.
No secrets on these pages: the site is public.
