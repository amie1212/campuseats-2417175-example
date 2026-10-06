# CampusEats (IIUM Mahallah Pre-Ordering System)
> **Course:** BICS 3301 Cross-Platform Development & Architecture  
> **Student:** Abdullah Najmi (Matric: 2417175)  
> **Repository:** [campuseats-2417175-example](https://github.com/amie1212/campuseats-2417175-example)  
> **Live Web Application:** [https://amie1212.github.io/campuseats-2417175-example/](https://amie1212.github.io/campuseats-2417175-example/)

---

## 🌟 Overview & Concept

**CampusEats** is an Apple-inspired cafeteria pre-ordering web application tailored for the International Islamic University Malaysia (IIUM) campus community. It eliminates long queues at Mahallah cafeterias between lectures by allowing students to browse live menus, customize dish instructions, select pickup time windows, and track orders in real time.

---

## ✨ Full Functional Features

### 1. 🎓 Student Experience
- **Real-Time Global Search & Category Filters**: Search dishes across Mahallah stalls (Rice, Noodles, Western, Beverages, Snacks) or filter by "Under RM 5" and "Popular".
- **Multi-Stall Directory**: Featured bento cards for **Kafe Mahallah Faruq**, **Mahallah Ali Bistro**, **Halimah Gourmet Corner**, and **Bilal Kiosk & Chill**.
- **Interactive Cart & Tray Management**:
  - Quantity controls (increment/decrement/remove).
  - Multi-stall safety validation (warns before mixing stalls).
  - Takeaway (+RM 0.50 packaging) vs. Dine-In selector.
  - Pickup schedule picker (10-15 mins, after prayer, lunch rush, etc.).
  - Student promo vouchers (e.g. `IIUMEATS` for RM 2.00 off, `FARUQDEAL`, `FREESHIP`).
- **Express Campus Checkout**: Auto-fills student matric number and room, supports DuitNow QR Pay, Campus Cash, FPX, and Apple Pay simulation.
- **Live Order Timeline & Tracker**:
  - 4-step progress: *Received &rarr; Cooking &rarr; Ready for Pickup &rarr; Completed*.
  - Large digital pickup ticket code (e.g., `#FE-2401`).
  - Digital itemized receipt modal with barcode simulation.
- **Student Profile & Preferences**: Edit matric details, contact information, view total orders placed, and review app architecture details.

### 2. 👨‍🍳 Kitchen & Admin Portal (`#/admin`)
- **1-Click Role Switcher**: Instantly switch between Student mode and Cafeteria Manager / Staff mode from the header or admin gate.
- **Live Kitchen Display System (KDS)**:
  - Real-time incoming queue tickets.
  - Advance orders: `[🍳 Start Cooking]`, `[🔔 Mark Ready for Pickup]`, `[✓ Handed Over]`, or `[Reject]`.
- **Menu Inventory Manager (Full CRUD)**:
  - Add new dishes with price, description, prep time, emoji icons, and dietary tags.
  - Instant one-click toggle for **In Stock / Sold Out**.
  - Edit dish details & delete discontinued items.
- **Cafeteria Operational Controls**:
  - Toggle stall status: **Open for Orders** vs. **Closed / Break**.
  - Broadcast live kitchen announcement banner across student screens (e.g., *"Fresh Sambal Sotong ready at 12:00 PM!"*).
- **Sales Analytics Dashboard**: Real-time revenue (RM), order count, and queue volume.
- **Factory Reset**: One-click reset back to default IIUM seed data for grading and testing.

---

## 🎨 Design System: Apple-Inspired Human Interface

- **SF Pro Typography & Glassmorphism**: Frosted glass navigation with `backdrop-filter: blur(20px)` and dynamic saturation.
- **Bento Feature Grid**: Clean rounded cards (`border-radius: 20px`), subtle ambient drop shadows, and responsive grid layouts.
- **iPhone / Mobile Optimized**:
  - Full-bleed safe area insets (`env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`).
  - Native iOS-style bottom tab bar for mobile screens.
  - Minimum 44px touch targets compliant with iOS Human Interface Guidelines.
  - Apple Dynamic Island style floating toast pills.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + Vite 6 |
| **Routing** | React Router v7 (`HashRouter` for zero-404 GitHub Pages subpath compatibility) |
| **Styling** | Apple Modern CSS Design System (Custom properties, CSS Grid, Flexbox) |
| **Cloud & Auth** | Google Firebase v12 (Firestore & Google Auth) + Smart LocalStorage Hybrid Fallback |
| **Deployment** | GitHub Actions CI/CD to GitHub Pages |

---

## 🚀 Running Locally

```bash
# 1. Clone repository
git clone https://github.com/amie1212/campuseats-2417175-example.git
cd campuseats-2417175-example

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build production bundle
npm run build
```

---

## 🔑 Demo Access & Testing Hints

- **Admin Account Switch**: Click **"Staff View / Admin Panel"** in the top navigation or use the toggle button in the header/profile page.
- **Voucher Codes**:
  - `IIUMEATS` — RM 2.00 student discount.
  - `FARUQDEAL` — RM 1.50 Mahallah Faruq special deal.
  - `FREESHIP` — Waives takeaway packaging fee.
- **GitHub Pages Routing**: Built with `HashRouter` (`#/`, `#/cart`, `#/orders`, `#/admin`, `#/profile`), ensuring zero 404 errors when refreshing or sharing direct URLs with classmates.
