---
title: Privacy
description: Privacy notes for the SQL Visualizer website — what this site collects, what you submit, which third parties are involved, and what it does not do.
---

# Privacy

This page describes what the sql-visualizer.jvtools.cn website and the SQL Visualizer plugin each handle. The short version: the site records anonymous visit counts only, and the plugin collects nothing.

## What this site collects

The site ships a small self-hosted analytics beacon that records two kinds of events:

- Page views (page path, time)
- Download button clicks (which download entry was clicked)

Events are reported to this site's own `/api/v1/track` endpoint and stored in a self-hosted database. The beacon carries no code content — it could not in any case: all plugin analysis happens inside your local IDE process, invisible to the website.

## What you submit yourself

- **Feedback pool entries**: the type and description you submit on the feedback page, plus the IDE and plugin versions attached automatically, are used only to follow up on requests and reply.
- **Bounty e-mail**: the address you provide when joining a feature bounty is used only to deliver rewards and communicate about that request.

These are used by the site owner for the purposes above only and are not shared externally.

## Third parties involved

- **Cloudflare Pages**: the site is hosted on Cloudflare Pages; visits are subject to Cloudflare's own privacy policy (including its standard logging).
- **JetBrains Marketplace**: plugin download, installation and accounts happen on JetBrains' side and follow JetBrains' privacy policy — not this site's.

## What it does not do

- No ads
- No third-party analytics or tracking scripts (the beacon is self-hosted; data does not flow to third parties)
- The plugin does not upload your code: preview, restore and reverse conversion are local static analysis — SQL and code content never leave your machine

Questions, or a submitted feedback entry you would like removed — the [feedback pool](/en/about/feedback) is the place to ask.
