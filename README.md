# YourHealthCo

**MyHealth Co** is a web-based healthcare dashboard designed to manage patient wellness. It supports both **User** and **Admin** roles with secure login and authentication.

---

##  Features

###  User Login

* Users can sign in using their email and password.
* After login, users can:

  * View assigned **medicine schedules**.
  * Check their **meal plans**.
  * See personal health details in a dashboard view.

### 🛠Admin Login

* Admins can log in through a separate secure login.
* Admins have extended access:

  * Modify patient **medicine schedules**.
  * Update or change **meal plans**.
  * Access all registered patient details.

###  Authentication

* JWT-based token authentication (or session-based, depending on your setup).
* Protected routes for both **users** and **admins**.
* Role-based access control ensures data privacy and restricted actions.

---

##  Tech Stack

* **Frontend:** React + JSX + CSS
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Auth:** JWT or session cookies
* **Deployment:** Render / Vercel / Railway (customizable)

---

##  Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/myhealth-co.git
cd myhealth-co
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Environment Variables

Create a `.env` file and add:

```env
VITE_API_URL=http://your-backend-api
```

For backend:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the App

**Frontend:**

```bash
npm run dev
```

**Backend:**

```bash
npm run start
```

---

##  Folder Structure

```
myhealth-co/
├── client/         # React frontend
├── server/         # Node backend
├── models/         # Mongoose schemas
├── routes/         # Express routes
├── controllers/    # Logic handlers
```

---
<img width="1893" height="835" alt="image" src="https://github.com/user-attachments/assets/a7bbb4ea-edfa-435d-aed7-2d6aad907114" />
<img width="1883" height="896" alt="image" src="https://github.com/user-attachments/assets/ad6dc0f9-1841-4c11-b144-19940703c087" />



##  Credits

Developed by Yadnyesh Chaudhari
Open to contributions & feedback!

