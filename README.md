<div align="center">

<img src="https://burgertar.vercel.app/assets/burgertar-logo.png" alt="BURGERTAR Logo" width="140"/>

# BURGERTAR

**Fast. Fresh. No queues. No confusion.**  
A full-stack digital ordering system for a local burger joint — from customer order to cashier approval to live kitchen queue.

[![Live Demo](https://img.shields.io/badge/ORDER%20NOW-Live%20Demo-e63946?style=for-the-badge&logo=vercel&logoColor=white)](https://burgertar.vercel.app/)
[![Status](https://img.shields.io/badge/Status-Active-22c55e?style=for-the-badge)](https://burgertar.vercel.app/)
[![Admin Panel](https://img.shields.io/badge/Admin-Panel%20Included-f4a261?style=for-the-badge)](https://burgertar.vercel.app/)
[![Payment](https://img.shields.io/badge/Payment-QR%20%2F%20Cash-6366f1?style=for-the-badge)](https://burgertar.vercel.app/)

</div>

---

## What is BURGERTAR?

BURGERTAR is a lightweight yet complete **digital point-of-sale and ordering system** built for a local burger stall. Customers browse the menu, build their order, choose how to pay, and get updates — all without needing an app or account.

On the other side, the admin panel gives the cashier full control over approvals, live queue management, menu items, promo codes, and sales analytics.

---

## Features

### Customer Side
- **Browse by Category** — Filter by Ayam, Lembu, Ikan, Benjo, Itik, Arnab, Kambing, Crispy, Smash, and more
- **Live Cart** — Add items, apply promo codes, see subtotal and discounts in real time
- **2-Step Checkout** — Enter name and phone, pick a payment method, done
- **Dual Payment Support** — QR payment (upload receipt for verification) or Cash (cashier approval required)
- **Contact Preference** — Choose WhatsApp Chat, WhatsApp Call, or Phone Call for order updates
- **Order Confirmation** — Unique order ID generated on submission with real-time status

### Admin Panel
- **Dashboard** — Today's revenue, total orders, pending count, and average order value at a glance
- **Order Management** — Filter orders by status: Pending → Approved → Preparing → Ready → Completed
- **Live Queue** — Track active kitchen queue in real time
- **Counter Orders** — Create walk-in orders directly from the admin panel
- **Menu Management** — Add/edit items with photo, category, stock status, and multiple price tiers (Normal, Special, Double, Double Special)
- **Promo Codes** — Create percentage or fixed-amount discounts with minimum order and expiry settings
- **Analytics** — Top selling items, payment method breakdown, and order status distribution

---

## Order Flow

```
Customer Browses Menu
        ↓
  Adds Items to Cart
        ↓
  Applies Promo Code (optional)
        ↓
   Enters Customer Info
        ↓
  Selects Payment Method
   ┌────────────────────┐
   │  QR Payment        │   Upload receipt → auto-verification
   │  Cash Payment      │   Cashier approves before prep begins
   └────────────────────┘
        ↓
  Order Submitted (Unique Order ID)
        ↓
  Cashier Reviews & Approves
        ↓
  Kitchen Prepares → Ready → Collected
```

---

## Price Tiers

Each menu item supports up to 4 price variants:

| Tier | Description |
|------|-------------|
| **Normal** | Standard single-patty / portion |
| **Special** | Upgraded with extras or larger size |
| **Double** | Double patty / double portion |
| **Double Special** | Double patty with full extras |

---

## Getting Started

> No installation needed — visit [burgertar.vercel.app](https://burgertar.vercel.app/) directly.

### As a Customer

1. Click **Start Your Order**
2. Browse categories and add items to your cart
3. Apply a promo code if you have one
4. Enter your name, phone number, and contact preference
5. Choose QR or Cash payment and confirm your order
6. Keep your **Order ID** — the cashier will contact you when it's ready

### As an Admin / Cashier

1. Click **Admin Access** on the homepage
2. Sign in with your credentials
3. Manage incoming orders, update statuses, and monitor the live queue

> Default demo credentials: `admin` / `admin123`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Vercel |
| Payments | QR (receipt upload) + Cash approval flow |
| Media | Vercel-hosted assets |

---

## Project Structure

```
burgertar/
├── assets/
│   ├── burgertar-logo.png
│   └── qr.jpeg
├── index.html          # Customer-facing storefront
├── admin.html          # Admin & cashier panel
└── ...
```

---

## Roadmap

- [ ] Real-time order push notifications (SMS / WhatsApp API)
- [ ] Persistent order history with database backend
- [ ] Printer receipt integration (thermal printer support)
- [ ] Customer order tracking page (live status by Order ID)
- [ ] Inventory / stock deduction automation
- [ ] Multi-outlet support

---

## Contributing

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## Author

Built by [@Paim41](https://github.com/Paim41)

---

<div align="center">

**BURGERTAR** — Burger Power, Rasa Luar Biasa.

[burgertar.vercel.app](https://burgertar.vercel.app/)

</div>
