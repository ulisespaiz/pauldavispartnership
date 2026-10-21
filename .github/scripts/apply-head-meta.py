#!/usr/bin/env python3
"""Inject the CSP and referrer meta tags into every HTML page.

GitHub Pages ignores _headers, so the Content-Security-Policy from _headers
is carried as a <meta http-equiv> tag instead. Directives that browsers
ignore in a meta CSP (frame-ancestors, report-uri, report-to, sandbox) are
dropped. The tags go right after the charset meta so the policy covers
every link and script that follows.

Idempotent: existing CSP and referrer meta tags are removed before the
current ones are inserted. Run from anywhere:

    python3 .github/scripts/apply-head-meta.py
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
META_UNSUPPORTED = {"frame-ancestors", "report-uri", "report-to", "sandbox"}
REFERRER = "strict-origin-when-cross-origin"


def read_csp():
    for line in (ROOT / "_headers").read_text().splitlines():
        name, sep, value = line.strip().partition(":")
        if sep and name.lower() == "content-security-policy":
            directives = [d.strip() for d in value.split(";") if d.strip()]
            kept = [d for d in directives if d.split()[0].lower() not in META_UNSUPPORTED]
            return "; ".join(kept)
    sys.exit("No Content-Security-Policy found in _headers")


def html_pages():
    skip = {".git", ".github", "node_modules", ".wrangler"}
    for path in sorted(ROOT.rglob("*.html")):
        if not skip.intersection(path.relative_to(ROOT).parts):
            yield path


def main():
    csp = read_csp()
    old_tags = re.compile(
        r'[ \t]*<meta\s+(?:http-equiv="Content-Security-Policy"|name="referrer")[^>]*>\n',
        re.IGNORECASE,
    )
    charset = re.compile(r'^([ \t]*)(<meta\s+charset="[^"]*">)\n', re.IGNORECASE | re.MULTILINE)
    changed = 0
    for path in html_pages():
        text = path.read_text()
        stripped = old_tags.sub("", text)
        match = charset.search(stripped)
        if not match:
            sys.exit(f"No charset meta in {path.relative_to(ROOT)}")
        indent = match.group(1)
        tags = (
            f'{indent}<meta http-equiv="Content-Security-Policy" content="{csp}">\n'
            f'{indent}<meta name="referrer" content="{REFERRER}">\n'
        )
        updated = stripped[: match.end()] + tags + stripped[match.end():]
        if updated != text:
            path.write_text(updated)
            changed += 1
            print(f"updated {path.relative_to(ROOT)}")
    print(f"{changed} file(s) changed")


if __name__ == "__main__":
    main()
