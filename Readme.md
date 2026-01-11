🚨 ResQnet — Real-Time SOS & Community Alert Platform

ResQnet is a real-time SOS and community alert system designed to reduce emergency response time by instantly notifying nearby users and relevant responders with live location, map-based navigation, and AI-assisted alert classification.

It is built to handle emergencies such as:

Harassment / Personal safety threats

Medical emergencies

Fire incidents

Accidents and other critical situations

The platform focuses on speed, locality, and actionable information rather than broad, delayed broadcasts.

🧠 Key Features

📍 Live Location Tracking using Google Maps

🚨 One-tap SOS Alert System

👥 Nearby User Notification System (real-time via WebSockets)

🗺️ Map View with Navigation to Victim

🤖 Gemini AI-powered Alert Classification

Automatically categorizes alert (Fire, Medical, Harassment, etc.)

Assigns priority level for faster handling

🗂️ Incident Logging & History

Stored for future area-wise risk analysis

🧪 Demo / Prototype Mode

For hackathons and presentations (no real emergency calls)

🏗️ Tech Stack
Frontend

HTML, CSS, JavaScript

Tailwind CSS

Leaflet / Google Maps API

Backend

Python (Flask)

Flask-SocketIO (Real-time communication)

REST APIs

AI

Google Gemini API (for text understanding & classification)

Database

(Your DB here: SQLite / PostgreSQL / MongoDB, etc.)

Hosting

Render (or any cloud provider)

⚙️ How It Works

User clicks an SOS button (e.g., Fire, Harassment, Medical, Custom).

System:

Captures live GPS location

Sends alert to server

Server:

Uses Gemini AI to analyze and classify the message

Stores incident in database

Broadcasts alert to nearby online users

Nearby users:

Receive alert in real-time

See message + live location on map

Can navigate to the victim

🧪 Demo / Prototype Disclaimer

⚠️ This project currently includes a DEMO / PROTOTYPE MODE for hackathon and testing purposes.
It does not contact real police or emergency services.

🚀 Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/resqnet.git
cd resqnet

2️⃣ Create Virtual Environment & Install Dependencies
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt

3️⃣ Setup Environment Variables

Create a .env file:

GOOGLE_MAPS_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here

4️⃣ Run the Server
python app.py


Open in browser:

http://localhost:5000

🧩 Project Structure
resqnet/
│── app/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   ├── socket/
│── static/
│── templates/
│── app.py
│── requirements.txt
│── README.md

🔐 Security Notes

This is a prototype system

Authentication, abuse prevention, and false-alert protection are not production hardened yet

Do not use in real-life critical deployments without proper audits

📈 Future Plans

📱 Android & iOS App (via Capacitor / Native)

📡 FCM Push Notifications

👮 Authority / Responder Dashboard

🧠 Smarter AI-based false-alert detection

🌐 City / Campus / Society level deployments

📊 Heatmap & crime-risk analytics

👨‍💻 Team

Team Name: The HiveMinds
Project: ResQnet — Real-Time SOS & Community Alert System

📜 License

This project is for educational, hackathon, and prototype purposes.
