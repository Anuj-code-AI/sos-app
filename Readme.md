# 🚨 ResQnet — Real-Time SOS & Community Alert System

ResQnet is a **real-time SOS and community alert platform** built to help people get **faster assistance during emergencies** such as:

- Harassment / personal safety threats  
- Medical emergencies  
- Fire incidents  
- Accidents  

The system focuses on **instant alerts, live location sharing, and community-driven response** instead of slow, centralized reporting systems.

It is designed as a **hackathon + prototype project** to demonstrate how technology can **reduce response time and improve situational awareness**.

---

## 🚀 Features

### ✔ SOS Alert System
- One-tap emergency alert buttons (Fire, Medical, Harassment, Custom)
- Captures **live GPS location**
- Sends alert instantly to server

### ✔ Real-Time Community Alerts
- Nearby users receive alerts in **real-time using WebSockets**
- Alert contains:
  - Emergency message
  - Live location
  - Map view with navigation support

### ✔ AI-Powered Alert Classification
- Uses **Google Gemini AI**
- Automatically:
  - Classifies alert type (Fire, Medical, Harassment, etc.)
  - Assigns priority level
- Helps in smarter and faster response handling

### ✔ Map Integration
- Uses **Google Maps / Leaflet**
- Shows:
  - Victim location
  - Nearby responders
  - Navigation route

### ✔ Incident Logging
- All incidents are stored in database
- Can be used later for:
  - Area-wise risk analysis
  - Safety insights
  - Heatmaps (future scope)

### ✔ Demo / Prototype Mode
- Includes **cinematic demo mode** for presentation
- No real emergency services are contacted

---

## 🔐 Security & Reliability

- Uses **WebSockets** for real-time delivery
- Uses **server-side validation**
- Prevents fake client-side alert injection
- Database-backed incident storage
- Prototype-level security (not production hardened)

---

## 🧪 Important Disclaimer

> ⚠️ **This is a DEMO / PROTOTYPE PROJECT.**  
> It does **NOT** contact real police, ambulance, or emergency services.  
> It is made for **hackathons, demonstrations, and learning purposes only**.

---

## 🏗️ Tech Stack

### Frontend
- HTML, CSS, JavaScript
- Tailwind CSS
- Leaflet / Google Maps API

### Backend
- Python (Flask)
- Flask-SocketIO (Real-time communication)
- REST APIs

### AI
- Google Gemini API (for alert understanding & classification)

### Database
- SQLite / PostgreSQL 

### Hosting
- Render 

---

## 🗂 Project Structure

resqnet/\
│── app/\
│ ├── controllers/\
│ ├── services/\
│ ├── repositories/\
│ ├── socket/\
│── static/\
│── templates/\
│── app.py\
│── requirements.txt\
│── README.md


---

## ⚙️ Setup & Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/resqnet.git
cd resqnet
```

## 2️⃣ Create Virtual Environment & Install Dependencies

```
python -m venv venv
venv\Scripts\activate   # On Windows
pip install -r requirements.txt
```

## 3️⃣ Setup Environment Variables
Create a .env file or update your config:

```
GOOGLE_MAPS_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```


## 4️⃣ Run the Server
```
python app.py
```

## Open in browser:
```
http://localhost:5000
```

## ▶️ How It Works

1. User clicks an SOS button

2. System captures:

        Location
        Message

3. Server:

        Sends text to Gemini AI
        Classifies priority & type
        Stores incident in database
        Broadcasts alert to nearby users

4. Nearby users:

        Receive alert in real-time
        See location on map
        Can navigate to the victim




## 📈 Future Improvements

* 📱 Android & iOS App

* 🔔 FCM Push Notifications

* 👮 Authority Dashboard

* 🧠 False-alert detection using AI

* 🗺️ Crime / risk heatmaps

* 🏙️ Society / Campus / City deployment model

---

# 👥 Team

### Team Name: The HiveMinds
### Project: ResQnet — Real-Time SOS & Community Alert Platform

---
# 📜 License
This project is for educational, hackathon, and prototype purposes only.

---

## ⭐ Support:
If you like this project, star ⭐ the repository on GitHub!