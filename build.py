#!/usr/bin/env python3
"""
Build standalone, single-file versions of every lesson & reference doc.

The source files in lessons/ and reference/ link to shared assets
(../assets/styles.css, ../assets/quiz.js) so the course stays modular.
But a single HTML file opened on its own can't resolve those relative
paths -> it renders as plain text.

This inlines the CSS/JS and flattens cross-links into ./dist/, producing
portable files that render anywhere (browser, phone, print).

Usage:  python3 build.py
"""
import pathlib
import re

ROOT = pathlib.Path(__file__).parent
DIST = ROOT / "dist"
DIST.mkdir(exist_ok=True)

css = (ROOT / "assets" / "styles.css").read_text(encoding="utf-8")
js = (ROOT / "assets" / "quiz.js").read_text(encoding="utf-8")

link_re = re.compile(r'<link[^>]*href="[^"]*styles\.css"[^>]*>')
script_re = re.compile(r'<script[^>]*src="[^"]*quiz\.js"[^>]*></script>')

sources = list((ROOT / "lessons").glob("*.html")) + list((ROOT / "reference").glob("*.html"))

for src in sources:
    html = src.read_text(encoding="utf-8")
    html = link_re.sub(f"<style>\n{css}\n</style>", html)
    html = script_re.sub(f"<script>\n{js}\n</script>", html)
    # Flatten cross-links: everything lands in the same dist/ folder.
    html = html.replace('href="../reference/', 'href="').replace('href="../lessons/', 'href="')
    out = DIST / src.name
    out.write_text(html, encoding="utf-8")
    print(f"built {out.relative_to(ROOT)}")
