# Taija Ruuhijärvi — Writer's Website

A full-fledged website (frontend + backend + database) for publishing books, accepting order requests, and user registration with a personal account.

## Stack

- **Backend:** Node.js + Express + PostgreSQL, JWT authentication, bcrypt for passwords
- **Frontend:** React + Vite, React Router
- **Payment:** not connected — "Tilaukset" (orders) is a request form; you handle payment and confirmation yourselves (email/bank transfer), as agreed

## Project Structure

```
taija-site/
├── backend/          Express API + PostgreSQL
│   └── src/
│       ├── db/        schema.sql, seed.sql, migrate.js, pool.js
│       ├── middleware/ auth.js (JWT)
│       └── routes/     auth, books, orders, materials, blog, gallery, newsletter
└── frontend/         React (Vite) application
    └── src/
        ├── pages/      Home, About, Book, Gallery, Contact, Orders, Materials,
        │               Blog, BlogPost, Login, Register, Dashboard
        ├── components/ Navbar, Footer, ProtectedRoute
        ├── context/    AuthContext (stores JWT, user)
        └── api/        client.js — wrapper over fetch to /api/*
```

## Site Sections (corresponding to the original Wix site)

| Original (Wix)      | New site           |
|----------------------|----------------------|
| Home                 | `/` Home           |
| kuka minä olen?       | `/kuka-mina-olen` About Me |
| Töppötassut          | `/toppotassut` Book page |
| Kuvia                | `/kuvia` Gallery       |
| Yhteystiedot          | `/yhteystiedot` Contact |
| Tilaukset             | `/tilaukset` Order form (no online payment) |
| Materiaalit           | `/materiaalit` Materials (some — registered users only) |
| Blog                  | `/blog` and `/blog/:slug` |
| — (new)             | `/kirjaudu` Login, `/rekisteroidy` Register |
| — (new, better than original) | `/oma-tili` Personal account: summary, order history, "my library" of materials, profile |

### Personal Account (`/oma-tili`)

As you requested — this is not a copy of the site, but a separate useful section:
- **Summary**: number of orders, saved materials, subscription status, quick links
- **My Orders**: history of all requests with statuses (Vastaanotettu / Vahvistettu / Lähetetty / Peruutettu)
- **My Library**: saved materials with quick download
- **Profile**: change name, manage newsletter subscription

Order statuses are currently set manually in the database (`status` field in the `orders` table) — in the future this can easily be moved into a simple admin panel.

## Running Locally

### 1. Database

You need a running PostgreSQL. Create the database:

```bash
createdb taija_db
```

### 2. Backend

```bash
cd backend
cp .env.example .env     # and fill in your values (especially DATABASE_URL and JWT_SECRET)
npm install
npm run migrate          # creates tables and adds demo data (book, materials, blog, gallery)
npm run dev               # http://localhost:4000
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

Open http://localhost:5173 — requests to `/api/*` are automatically proxied to the backend (configured in `vite.config.js`).

> ⚠️ In this isolated environment where I built the project, there is no internet access for `npm install`,
> so I could not run and test the site live — the code was written and proofread manually
> (the backend was additionally checked with `node --check` for syntax). Be sure to run
> `npm install && npm run dev` on your end and let me know if something doesn't work — we'll fix it.

## What Needs to Be Replaced Before Production

1. **Images** — placeholders (placehold.co) are currently used for the book cover, Taija's photo, gallery, and blog. Replace `cover_image_url` / `image_url` in `backend/src/db/seed.sql` (or directly in the database) with real photos — the same ones as on the old Wix site.
2. **Downloadable materials** — `frontend/public/materials/*.pdf` are currently text placeholders. Put real PDFs (coloring pages, exercises) there with the same file names, or change `file_url` in the `materials` table.
3. **Email and contacts** — `frontend/src/pages/Contact.jsx` has `taija@example.com`, replace it with the real address.
4. **JWT_SECRET** in `.env` — be sure to generate a long random string for production.
5. **CORS/CLIENT_ORIGIN** — specify the production frontend domain.

## Deployment (Options)

I didn't set up any turnkey solutions since you haven't chosen a hosting provider yet. A couple of simple options:

- **Render / Railway** — spin up both the Node.js backend and managed PostgreSQL in a couple of clicks; the free tier is suitable to start.
- **Frontend**: Vercel or Netlify (simply builds `npm run build` → `dist` folder), or Render as a static site.
- Don't forget to set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN` in the backend hosting environment variables, and `VITE_API_URL`/proxy configuration if the frontend and backend will be on different domains (currently requests go to a relative `/api`, so with separate hosting you need to either configure a proxy on the frontend hosting or set up `VITE_API_URL` and modify `src/api/client.js`).

Let me know which hosting you choose — I'll help with the specific deployment setup.

## Possible Future Improvements

- A simple admin panel for Taija (adding books/materials/blog posts, changing order statuses) without direct database access
- Online payment (Stripe) if you decide to connect it later — the database structure doesn't block this
- Email notifications about new orders