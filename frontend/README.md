# PropTech — Property Listing Portal

A full-stack web application where property seekers can browse available listings, and landlords can advertise their properties. Built with React on the frontend and Flask on the backend.

-----

## What the App Does

- Browse all available property listings on the homepage
- Search and filter properties by title, city, or estate
- Click on a listing to view full details including description, price, and landlord info
- Leave a review on any property
- Add a new property listing through a dedicated form

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, React Router, Formik, Yup |
| Backend | Python, Flask, Flask-SQLAlchemy, Flask-CORS |
| Database | SQLite |
| Styling | Custom CSS |

---

## Project Structure

```
proptech-app/
├── frontend/        # React app
└── backend/         # Flask API
    ├── app.py       # All routes
    ├── models.py    # Database models
    ├── database.py  # SQLAlchemy setup
    ├── seed.py      # Sample data
    └── proptech.db  # SQLite database (auto-created)
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/proptech-app.git
cd proptech-app
```

### 2. Set up the backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
python seed.py
python app.py
```

Backend runs at: `http://localhost:5555`

### 3. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## Pages

| Route | Description |
|---|---|
| `/` | Homepage — all property listings |
| `/properties/:id` | Single property detail page |
| `/add` | Add a new property listing |
| `/about` | About the platform |

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /properties | Get all properties |
| GET | /properties/:id | Get a single property |
| POST | /properties | Create a new property |
| PATCH | /properties/:id | Update a property |
| DELETE | /properties/:id | Delete a property |
| GET | /landlords | Get all landlords |
| POST | /landlords | Create a landlord |
| GET | /seekers | Get all seekers |
| POST | /seekers | Create a seeker |
| POST | /saved_properties | Save a property |
| DELETE | /saved_properties/:id | Unsave a property |
| POST | /reviews | Submit a review |
| DELETE | /reviews/:id | Delete a review |

---

## Database Models

- **Landlord** — has many Properties
- **Property** — belongs to a Landlord, has many Reviews, saved by many Seekers
- **Seeker** — saves many Properties
- **SavedProperty** — links Seekers and Properties, includes a personal note
- **Review** — belongs to a Property

