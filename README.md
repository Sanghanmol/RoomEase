# 🏨 RoomEase - Smart Hotel Room Booking System

An interactive hotel room reservation system with a **movie ticket-style UI**, optimized room booking logic, and smooth animations.  
Built with **React + Material UI + Framer Motion**. 

---

## 📌 Overview
RoomEase is a hotel room reservation system that:

✅ Allows guests to book up to **5 rooms at a time**  
✅ Dynamically **calculates total travel time**  
✅ **Optimally assigns rooms** based on proximity rules  
✅ **Interactive UI** like a movie ticket booking system  
✅ Includes **click-to-book, random occupancy, and reset features**

---

## 🚀 Features

- 📍 **10 Floors, 97 Rooms (Floor 1-9: 10 rooms, Floor 10: 7 rooms)**
- 🏃 **Travel Time Rules:**  
  - 1 min per adjacent room (horizontal)  
  - 2 mins per floor (vertical)
- 🛎 **Booking Rules:**  
  - Max 5 rooms per guest  
  - Priority for **same floor rooms**  
  - If unavailable → **choose rooms with minimum total travel time**
- 🎲 **Random Occupancy Button**
- 🔄 **Reset Button**
- ✅ **Snackbar alerts** for all actions
- 🎬 **Smooth animations with Framer Motion**
- 📱 **Responsive UI (works on all screen sizes)**

---

## 🖥️ Tech Stack
- ⚛️ React + Vite
- 🎨 Material-UI (MUI)
- 🎞 Framer Motion
- 💾 LocalStorage (for room persistence)

---

## 📸 UI Preview
- Left panel shows floors  
- Right panel shows rooms like **movie ticket booking layout**  
- Click a room → Book it  
- Double-click → Unbook it  

---

## 🛠️ Installation & Run

# Clone the repo
- git clone https://github.com/Sanghanmol/RoomEase.git
- cd roomease

# Install dependencies
npm install

# Run the app
npm run dev

---

## 🚀 Usage
1️⃣ Enter number of rooms (1-5)  
2️⃣ Click **"Book"** → Automatically assigns optimal rooms  
3️⃣ **Single Click** a room → Book instantly  
4️⃣ **Double Click** a booked room → Unbook it  
5️⃣ Click **"Random"** → Generate random occupancy  
6️⃣ Click **"Reset"** → Reset all bookings  

---

## 🎨 UI Highlights  
✅ Legend for **Available / Booked / Last Booked**  
✅ **Snackbar alerts** for all actions  
✅ **Smooth animations** using Framer Motion  
✅ **Movie Ticket Style Layout** (Floors left, Rooms right)  

---

### 📜 License

MIT License © 2025 - Created with ❤️ by Anmol Sangha

---
