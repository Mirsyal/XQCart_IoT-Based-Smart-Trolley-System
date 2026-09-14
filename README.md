# 🛒 XQCart — IoT Smart Trolley

**XQCart** is a **React-based IoT smart trolley web application** that uses **RFID and Firebase Realtime Database** to automatically identify products and manage a shopper's cart in real time.

The system connects the **physical smart trolley and web application through Firebase**, allowing scanned RFID tags to be converted into products and automatically added to the user's shopping cart.

---

## 🚀 Key Features

* **RFID-based product detection** — scanned products are automatically identified and added to the cart
* **Real-time shopping cart** — cart updates are synchronized through Firebase
* **Budget management** — users can set a shopping budget and receive warnings when it is exceeded
* **Voucher system** — validates and applies discounts during checkout
* **Purchase history** — stores and displays previous transactions
* **Digital receipts** — generates downloadable PDF receipts
* **User authentication** — registration, login, password reset and account management
* **Profile management** — profile editing with Cloudinary image uploads
* **Progressive Web App (PWA)** — installable web application with offline-ready PWA infrastructure

---

## 🧩 How It Works

```text
RFID Tag Scanned
       ↓
IoT Trolley / ESP32
       ↓
Firebase Realtime Database
       ↓
React detects RFID tag in real time
       ↓
Product identified
       ↓
Product added to user's cart
       ↓
Checkout → Voucher → Payment Selection
       ↓
Transaction saved + Digital Receipt
```

**Firebase acts as the communication bridge between the IoT trolley and the React application.**

---

## 🛠️ Tech Stack

| Technology                     | Purpose                            |
| ------------------------------ | ---------------------------------- |
| **React 19**                   | Frontend application               |
| **JavaScript / JSX**           | Application development            |
| **Vite**                       | Development and production build   |
| **React Router**               | Page navigation                    |
| **Firebase Authentication**    | User authentication                |
| **Firebase Realtime Database** | Real-time data & IoT communication |
| **Cloudinary**                 | Profile image hosting              |
| **html2canvas**                | Receipt rendering                  |
| **jsPDF**                      | PDF receipt generation             |
| **vite-plugin-pwa**            | Progressive Web App functionality  |
| **ESLint**                     | Code quality                       |

---

## 💡 Technical Highlights

### Real-Time IoT Integration

Instead of connecting the frontend directly to the physical trolley, Firebase Realtime Database is used as a **real-time communication layer**.

### RFID Product Mapping

Each RFID tag is mapped to a product in Firebase. When a tag is detected, the React application retrieves the corresponding product and updates the user's cart.

### Firebase-Based Data Architecture

```text
users/{uid}
products/{rfidTagId}
tags/{uid}/{rfidTagId}
cart/{uid}/{rfidTagId}
vouchers/{voucherCode}
history/{uid}/{timestamp}
```

### Digital Receipt Generation

The application uses **html2canvas + jsPDF** to convert the receipt interface into a downloadable PDF.

---

## 📱 Application Pages

| Page                 | Function                      |
| -------------------- | ----------------------------- |
| **Login / Register** | User authentication           |
| **Home**             | RFID detection, cart & budget |
| **Payment**          | Voucher & payment selection   |
| **History**          | Previous purchases            |
| **Profile**          | User profile management       |
| **Settings**         | Account settings              |
| **Receipt**          | Digital purchase receipt      |

---

## ⚙️ Run Locally

### Requirements

* Node.js
* npm
* Firebase project

### Installation

```bash
git clone <repository-url>
cd XQCart
npm install
npm run dev
```

The application will be available through the local Vite development server.

### Other Commands

```bash
npm run build
npm run preview
npm run lint
```

---

## ⚠️ Project Scope

The current repository contains the **React web application and its Firebase integration**.

The physical trolley's ESP32 firmware and RFID hardware implementation are maintained separately and are not included in this repository.

The payment interface currently **records the selected payment method but does not process real financial transactions**.

---

## 🎯 What This Project Demonstrates

**XQCart demonstrates practical experience with:**

`React` · `JavaScript` · `Firebase` · `Real-Time Data` · `IoT Integration` · `RFID` · `REST/HTTP` · `PWA` · `PDF Generation` · `Authentication` · `Responsive UI`

---

## 👩‍💻 Project

**XQCart — IoT Smart Trolley Web Application**

Built using **React + Firebase + RFID + IoT**.
