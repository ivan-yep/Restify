sudo apt update
sudo apt upgrade
sudo apt install python3
sudo apt-get install python3-pip
sudo pip3 install virtualenv 
sudo apt-get install curl
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
nvm install --lts
nvm install node
cd frontend
npm install react-router-dom
npm install react-helmet-async
npm install react-bootstrap
npm i react-multi-select-component
npm install formik
npm install yup
npm install react-datepicker
npm install @mui/material @emotion/react @emotion/styled --legacy-peer-deps
cd ..
virtualenv -p /usr/bin/python3 backend/restify/venv
source backend/restify/venv/bin/activate
pip install Django
python3 -m pip install --upgrade pip
python3 -m pip install --upgrade Pillow
pip install django-cors-headers
pip install djangorestframework
pip install markdown
pip install django-filter 
pip install djangorestframework-simplejwt
pip install django-cleanup
cd backend/restify
find . -name "*.pyc" -type f -delete
rm db.sqlite3
python3 manage.py makemigrations
python3 manage.py migrate
cd .. 
cd ..