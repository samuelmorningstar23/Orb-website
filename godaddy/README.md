# Demo-request mailer (GoDaddy hosting)

The marketing site is a static build on GitHub Pages, so it cannot send email
itself. `demo-request.php` runs on the GoDaddy hosting plan and emails demo
requests to **support@orbintelligence.co** server-side — no visitor mail client
required.

The site POSTs to `https://api.orbintelligence.co/demo-request.php`. Until that
URL exists, the form automatically falls back to opening the visitor's mail
client, so nothing breaks while you set this up.

---

## Setup (one time)

### 1. Find your hosting IP
cPanel → right-hand sidebar → **General Information → Shared IP Address**.
(Or GoDaddy → My Products → Web Hosting → Manage.) Copy that IP.

### 2. Create the `api` subdomain
cPanel → **Domains → Create A New Domain** (or **Subdomains**).
- Domain: `api.orbintelligence.co`
- Document root: `public_html/api` (the default is fine)

### 3. Point DNS at it
GoDaddy → **DNS → Manage DNS → Add record**:

| Type | Name | Value | TTL |
|------|------|------------------------|-----|
| A    | `api`| *your hosting IP from step 1* | 600 |

> Only the `api` record goes to GoDaddy. **Leave the `@` and `www` records
> pointing at GitHub** — those serve the website.

### 4. Upload the script
cPanel → **File Manager** → `public_html/api/` → upload `demo-request.php`.

### 5. Turn on HTTPS for the subdomain
cPanel → **SSL/TLS Status** → tick `api.orbintelligence.co` → **Run AutoSSL**.

This is required, not optional: the site is served over `https://`, and browsers
block a plain-`http://` request from an `https://` page (mixed content).

### 6. Make sure the inbox exists
`support@orbintelligence.co` must be a real mailbox **or** a forward to one you
read, or the mail will bounce. GoDaddy → Email & Office.

---

## Verify

```bash
curl -i -X POST https://api.orbintelligence.co/demo-request.php \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://orbintelligence.co' \
  -d '{"name":"Test","email":"you@example.com","company":"Test Co","purpose":"checking the mailer"}'
```

Expect `HTTP/1.1 200` and `{"ok":true}`, and an email in support@.

Then submit the real form on the site — the success screen should read *"Your
request has been sent to our team"* (server path) rather than *"We've opened
your email client"* (fallback path).

---

## Notes

- **`From:` is `noreply@orbintelligence.co`** and must stay on your own domain.
  Using the visitor's address there would fail SPF and get the mail spam-binned
  or rejected. `Reply-To:` is set to the requester, so hitting Reply answers
  them directly.
- **Spam:** a hidden honeypot field (`website`) is accepted silently when filled,
  so bots don't retry.
- **Security:** CR/LF are stripped from any value used in a mail header, which
  blocks header-injection (e.g. sneaking a `Bcc:` in via the name field).
- Only `orbintelligence.co` and `www.orbintelligence.co` are allowed by CORS.
- This file is intentionally **outside** `public/` so the Vite build never ships
  it to GitHub Pages, where it would be served as readable source instead of run.
