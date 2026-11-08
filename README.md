# EventHub – Responsive Event Management Website

A modern, fully responsive event management website where users can browse upcoming events, search and filter them, view detailed information and register through a validated form.

**Live Demo:** `<https://harshit7-raj.github.io/EventHUB/
**GitHub Repository:** https://github.com/harshit7-raj/EventHUB

## Features

### Core
- **Hero section** introducing the platform with call-to-action buttons.
- **Event cards** showing name, date, venue, image, price and a short description.
- **Search** by name, venue, category or keyword (debounced for smooth typing).
- **Category filter** chips (All, Technology, Music, Workshop, Business, Sports, Art) and **sorting** by date, name or price.
- **Event details modal** with full description, venue, date, price and seats.
- **Registration form** collecting name, email, phone number and selected event.
- **JavaScript form validation** with live, field-level error messages:
  - Name: at least 3 characters, letters only.
  - Email: valid email format.
  - Phone: 10-digit Indian mobile number (starts with 6-9), digits only.
  - Event: must be selected.
  - Duplicate registrations (same email + same event) are blocked.
- **Confirmation message** with a ticket-style summary and booking ID after successful submission.
- **Fully responsive** for mobile, tablet and desktop (CSS Grid, Flexbox, media queries, hamburger menu).

### Bonus
- 🌙 **Dark / light mode** – remembers your choice and respects the OS preference.
- ⏳ **Countdown timers** – live countdown to the next event in the hero, and per event inside the modal.
- ✨ **Animations** – fade-in cards, hover lifts, scroll-reveal sections, animated success check, animated hero gradient (respects `prefers-reduced-motion`).
- 💾 **Local Storage registration management** – registrations persist across reloads; view them in *My Registrations* and cancel any of them.

## Tech Stack
- HTML5 (semantic elements, ARIA attributes)
- CSS3 (custom properties, Grid, Flexbox, transitions, keyframes)
- Vanilla JavaScript (ES6+, DOM manipulation, Local Storage, IntersectionObserver)
- Git & GitHub for version control

## Project Structure
```
event-website/
├── index.html    # Page structure, modal and form markup
├── style.css     # Theming, layout, components, responsive rules
├── script.js     # Event data, rendering, filtering, validation, storage, theme
└── README.md
```

## How It Works
1. `script.js` holds an `events` array. Cards are rendered from it with `renderEvents()`, filtered by `getFilteredEvents()` (search + category + sort).
2. Clicking **View Details** or **Register** opens the modal (`openModal`) and pre-selects that event in the form.
3. On submit, each field is checked by the `validators` object. If everything is valid, a registration object is saved to `localStorage` under the key `eventhub_registrations`.
4. A confirmation view with a booking ID is shown, and the *My Registrations* list, stats and badge update instantly.
5. Theme preference is stored under `eventhub_theme`.

## Run Locally
No build step is needed.
```bash
git clone <your-repo-url>
cd event-website
# open index.html in your browser, or use a simple server:
python -m http.server 8000
```

## Deployment

**GitHub Pages**
1. Push the project to a GitHub repository.
2. Go to *Settings → Pages*, choose the `main` branch and `/ (root)` folder, then save.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.

**Netlify / Vercel**
- Import the GitHub repository, leave the build command empty and set the publish directory to the root (`/`).

## Git Workflow
```bash
git init
git add .
git commit -m "Initial commit: EventHub event management website"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Notes
- Event images are loaded from Unsplash; if an image fails to load, the card still displays gracefully.
- All data is stored in the browser only; no backend is used.

## Author
Made with ❤️ as part of the Responsive Event Management Website task.
