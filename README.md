# 🛒 XQCart — IoT Smart Trolley

**XQCart** is a **React-based IoT smart trolley application** that combines **ESP32, RFID, Arduino IDE, Firebase, and React** to automatically identify products and manage a shopper's cart in real time.

The smart trolley uses an **ESP32-based IoT controller and RFID technology** to detect products. The detected RFID tag data is transmitted to **Firebase Realtime Database**, which acts as the communication bridge between the trolley and the React web application.

---

## 🚀 Key Features

* **RFID-based product detection** — scanned products are automatically identified and added to the cart
* **ESP32 IoT integration** — ESP32-based controller handles RFID detection and communication
* **Real-time shopping cart** — cart updates are synchronized through Firebase
* **Budget management** — users can set a shopping budget and receive warnings when it is exceeded
* **Voucher system** — validates and applies discounts during checkout
* **Purchase history** — stores and displays previous transactions
* **Digital receipts** — generates downloadable PDF receipts
* **User authentication** — registration, login, password reset and account management
* **Profile management** — profile editing with Cloudinary image uploads

---

## 🧩 How It Works

```text
                    Physical Smart Trolley
                            │
                            ▼
                      RFID Reader
                            │
                            ▼
                         ESP32
                    (Arduino IDE)
                            │
                            │ RFID Tag Data
                            ▼
                Firebase Realtime Database
                            │
                            │ Real-time listener
                            ▼
                     React Application
                            │
                            ▼
                    Product Identification
                            │
                            ▼
                      Shopping Cart
                            │
                            ▼
                 Checkout & Voucher
                            │
                            ▼
                  Transaction History
                            │
                            ▼
                    Digital Receipt
```

**Firebase Realtime Database acts as the communication bridge between the ESP32-based smart trolley and the React web application.**

---

## 🛠️ Tech Stack

### IoT & Hardware

| Technology      | Purpose                                    |
| --------------- | ------------------------------------------ |
| **ESP32**       | IoT controller for the smart trolley       |
| **RFID**        | Product identification                     |
| **Arduino IDE** | ESP32 firmware development and programming |

### Web Application

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

### 🔌 ESP32 & IoT Integration

The smart trolley uses an **ESP32 microcontroller** as the IoT controller.

The ESP32 is programmed using the **Arduino IDE** and is responsible for handling the RFID-based product detection and communicating the detected tag information to the backend communication layer.

### 📡 RFID Product Identification

Each product is associated with an RFID tag.

When a product is scanned:

```text
RFID Tag
   ↓
RFID Reader
   ↓
ESP32
   ↓
Firebase
   ↓
React
   ↓
Product added to cart
```

This allows products to be detected and added to the shopping cart without manually entering product information.

### 🔥 Real-Time Firebase Communication

Firebase Realtime Database provides the communication layer between the IoT trolley and web application.

The React application listens for RFID tag data in real time and maps the received tag ID to the corresponding product.

### 🛒 Smart Shopping Workflow

```text
Scan Product
     ↓
Detect RFID
     ↓
Send Tag Data
     ↓
Identify Product
     ↓
Update Cart
     ↓
Monitor Budget
     ↓
Checkout
     ↓
Apply Voucher
     ↓
Save Transaction
     ↓
Generate Receipt
```

### 🧾 Digital Receipt Generation

The application uses **html2canvas + jsPDF** to generate downloadable PDF receipts containing purchase details, discounts, payment method, date and time.

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

## 🗄️ Firebase Data Structure

```text
users/{uid}
products/{rfidTagId}
tags/{uid}/{rfidTagId}
cart/{uid}/{rfidTagId}
vouchers/{voucherCode}
history/{uid}/{timestamp}
sessions/currentSession
```

The `tags` and `products` paths are particularly important for the RFID-to-product workflow.

---

## ⚙️ Run Locally

### Requirements

* Node.js
* npm
* Firebase project
* ESP32 development environment *(for the physical trolley)*

### Web Application

```bash
git clone <repository-url>
cd XQCart
npm install
npm run dev
```

Other commands:

```bash
npm run build
npm run preview
npm run lint
```

### IoT Development

The ESP32 portion is developed separately using:

**Arduino IDE + ESP32 + RFID hardware**

The ESP32 firmware is maintained separately from this React web application repository.

---

## ⚠️ Project Scope

This repository primarily contains the **React web application and Firebase integration**.

The physical trolley uses an **ESP32 and RFID hardware**, with firmware developed using **Arduino IDE**. The ESP32 firmware and hardware wiring are maintained separately and are not included in this repository.

The payment interface currently records the selected payment method but **does not process real financial transactions**.

---

## 🎯 Skills Demonstrated

**IoT & Hardware**

`ESP32` · `Arduino IDE` · `RFID` · `IoT Communication`

**Web Development**

`React` · `JavaScript` · `Vite` · `React Router` · `CSS`

**Backend & Cloud**

`Firebase Authentication` · `Firebase Realtime Database` · `Cloudinary`

**Other**

`PWA` · `PDF Generation` · `Real-Time Data` · `Git` · `ESLint`

---

## 👩‍💻 Project

**XQCart — IoT Smart Trolley**

Built using:

**ESP32 + Arduino IDE + RFID + Firebase + React**
