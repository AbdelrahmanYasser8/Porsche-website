# Porsche-website

## Seed admin account

The app now seeds a default admin account automatically on server startup.

You can also create or reset it manually with:

`POST /api/auth/seed-admin`

Defaults:

- Email: `admin@porsche.com`
- Password: `Admin123!`
- Name: `Admin`

You can override these with `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD`.
