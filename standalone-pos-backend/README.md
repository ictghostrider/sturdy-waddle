# Standalone POS Backend (Flat)

This backend runs online/offline POS logic in a single folder setup.

## Routes:
- POST `/transactions`
- POST `/offline/save`
- GET `/offline/all`
- GET `/reports/daily`

## Run it:
```bash
npm install
node server.js
```