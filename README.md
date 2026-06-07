# Porsche-website

## Environment setup

Create a `.env` file and configure the database, session, CORS, seed admin,
and SMTP values. The backend will not start unless `DB_URI`,
`SESSION_SECRET`, and `CORS_ORIGIN` are present.

## Seed admin account

The app seeds the admin account configured in `.env` on server startup.

You can also create or reset it manually with:

`POST /api/auth/seed-admin`

Configure `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and
`SEED_ADMIN_PASSWORD`. The seed operation is skipped when any value is
missing.

## Order email notifications

The backend emails customers when:

- An order is placed.
- An administrator changes an order status.

Add the SMTP settings below to `.env` and provide credentials from your email
provider:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM=Porsche <orders@example.com>
```

Use `SMTP_SECURE=true` with port `465`. Port `587` normally uses
`SMTP_SECURE=false` and upgrades the connection with STARTTLS.

If SMTP is not configured or delivery fails, the order operation still
succeeds and the backend logs the email issue.
