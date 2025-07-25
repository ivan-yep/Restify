#!/bin/bash

# Server runs on: localhost:8000
# Frontend runs on: localhost:3000
sudo kill -9 `sudo lsof -t -i:3000`
sudo kill -9 `sudo lsof -t -i:8000`
cd backend/restify
find . -name "*.pyc" -type f -delete
rm db.sqlite3
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py loaddata ../data.json
python3 manage.py runserver &
cd ..
cd ..
cd frontend 
npm start 