# DEAL Platform — Backend API Documentation
## دليل API للمنصة — مخصص لتطبيق Android

**Base URL:** `https://your-domain.com` (استبدل بالنطاق الخاص بك)
**Content-Type:** `application/json`
**Auth:** حالياً بدون JWT (المقارنة المباشرة لكلمة المرور) — يمكن إضافة JWT لاحقاً

---

## 📋 جدول المحتويات

1. [المصادقة (Authentication)](#1-المصادقة)
2. [المستخدمون (Users)](#2-المستخدمون)
3. [الخدمات (Services)](#3-الخدمات)
4. [المنتجات (Products)](#4-المنتجات)
5. [المعدات (Equipment)](#5-المعدات)
6. [الحجوزات (Bookings)](#6-الحجوزات)
7. [الطلبات (Orders)](#7-الطلبات)
8. [التقييمات (Reviews)](#8-التقييمات)
9. [الرسائل (Messages)](#9-الرسائل)
10. [الشكاوى (Complaints)](#10-الشكاوى)
11. [البحث (Search)](#11-البحث)
12. [الفئات (Categories)](#12-الفئات)
13. [الإشعارات (Notifications)](#13-الإشعارات)
14. [الإحصائيات (Stats)](#14-الإحصائيات)
15. [الشهادات (Testimonials)](#15-الشهادات)
16. [الإعدادات (Settings)](#16-الإعدادات)
17. [رفع الصور (Upload)](#17-رفع-الصور)
18. [اتصل بنا (Contact)](#18-اتصل-بنا)
19. [Admin APIs](#19-admin-apis)
20. [نماذج البيانات (Data Models)](#20-نماذج-البيانات)

---

## 1. المصادقة

### 🔐 POST `/api/auth/register` — تسجيل حساب جديد

```json
// Request Body
{
  "email": "user@deal.dz",
  "password": "pass123",
  "name": "أحمد",
  "nameFr": "Ahmed",
  "phone": "+213 77 000 00 00",
  "role": "CUSTOMER"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✅ | البريد الإلكتروني (فريد) |
| password | string | ✅ | كلمة المرور |
| name | string | ✅ | الاسم بالعربية |
| nameFr | string | ❌ | الاسم بالفرنسية |
| phone | string | ❌ | رقم الهاتف |
| role | string | ✅ | `CUSTOMER` / `CRAFTSMAN` / `MERCHANT` / `EQUIPMENT_OWNER` |

```json
// Response 201
{
  "id": "clx...",
  "email": "user@deal.dz",
  "name": "أحمد",
  "nameFr": "Ahmed",
  "phone": "+213 77 000 00 00",
  "role": "CUSTOMER",
  "city": "سوق أهراس",
  "rating": 0,
  "totalReviews": 0,
  "isActive": true,
  "isVerified": false,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

```json
// Error 409: { "error": "Email already registered" }
// Error 400: { "error": "Invalid role..." }
```

---

### 🔐 POST `/api/auth/login` — تسجيل الدخول

```json
// Request Body
{
  "email": "user@deal.dz",
  "password": "pass123"
}
```

```json
// Response 200 — نفس هيكل المستخدم (بدون password)
{
  "id": "clx...",
  "email": "user@deal.dz",
  "name": "أحمد",
  "role": "CUSTOMER",
  "avatar": null,
  "rating": 4.5,
  "totalReviews": 10,
  "isActive": true,
  "isVerified": true
}
```

```json
// Error 401: { "error": "Invalid credentials" }
```

---

## 2. المستخدمون

### 👤 GET `/api/users` — قائمة المستخدمين

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| role | string | تصفية حسب الدور: `CUSTOMER`, `CRAFTSMAN`, `MERCHANT`, `EQUIPMENT_OWNER`, `ADMIN` |
| search | string | بحث في الاسم والبريد |

```json
// Response 200 — Array of User objects
[
  {
    "id": "clx...",
    "email": "user@deal.dz",
    "name": "أحمد",
    "nameFr": "Ahmed",
    "phone": "+213 77 000 00 00",
    "role": "CUSTOMER",
    "avatar": null,
    "bio": "نبذة...",
    "bioFr": "Bio...",
    "city": "سوق أهراس",
    "wilaya": "سوق أهراس",
    "isVerified": false,
    "rating": 4.5,
    "totalReviews": 10,
    "specialties": "سباكة, كهرباء",
    "experience": 5,
    "hourlyRate": 1500,
    "shopName": "متجر أحمد",
    "shopNameFr": "Boutique Ahmed",
    "hasDelivery": true,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### 👤 GET `/api/users/{id}` — بيانات مستخدم واحد

```json
// Response 200
{
  "id": "clx...",
  "email": "user@deal.dz",
  "name": "أحمد",
  "role": "CRAFTSMAN",
  // ... all user fields ...
  "stats": {
    "services": 5,
    "products": 0,
    "equipment": 2
  }
}
```

```json
// Error 404: { "error": "User not found" }
```

---

### 👤 PATCH `/api/users/{id}` — تحديث بيانات المستخدم

```json
// Request Body (أي حقل أو أكثر)
{
  "name": "أحمد الجديد",
  "nameFr": "Ahmed New",
  "phone": "+213 77 111 11 11",
  "bio": "نبذة محدثة",
  "city": "سوق أهراس",
  "specialties": "سباكة, كهرباء, طلاء",
  "experience": 10,
  "hourlyRate": 2000,
  "shopName": "متجر أحمد المحدود",
  "hasDelivery": true,
  "avatar": "/uploads/photo.jpg"
}
```

**Allowed fields:** `name`, `nameFr`, `phone`, `bio`, `bioFr`, `city`, `wilaya`, `specialties`, `experience`, `hourlyRate`, `shopName`, `shopNameFr`, `isVerified`, `avatar`, `hasDelivery`, `isActive`

---

## 3. الخدمات

### 🔧 GET `/api/services` — قائمة الخدمات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| categoryId | string | تصفية حسب فئة |
| search | string | بحث في العنوان |
| minPrice | number | الحد الأدنى للسعر |
| maxPrice | number | الحد الأقصى للسعر |
| providerId | string | تصفية حسب مقدم الخدمة |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "title": "خدمة سباكة",
    "titleFr": "Service de plomberie",
    "description": "وصف الخدمة...",
    "descriptionFr": "Description...",
    "price": 1500,
    "priceUnit": "service",
    "images": "/uploads/img1.jpg,/uploads/img2.jpg",
    "isAvailable": true,
    "rating": 4.5,
    "totalReviews": 10,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "category": {
      "id": "clx...",
      "name": "سباكة",
      "nameFr": "Plomberie",
      "icon": "🔧"
    },
    "provider": {
      "id": "clx...",
      "name": "أحمد",
      "nameFr": "Ahmed",
      "avatar": null,
      "rating": 4.5,
      "totalReviews": 10,
      "isVerified": true
    }
  }
]
```

---

### 🔧 POST `/api/services` — إضافة خدمة جديدة

```json
// Request Body
{
  "providerId": "clx...",
  "categoryId": "clx...",
  "title": "خدمة سباكة",
  "titleFr": "Service de plomberie",
  "description": "وصف تفصيلي",
  "descriptionFr": "Description détaillée",
  "price": 1500,
  "priceUnit": "service",
  "images": "/uploads/img1.jpg,/uploads/img2.jpg"
}
```

**Required:** `providerId`, `categoryId`, `title`, `description`, `price`
**Optional:** `titleFr`, `descriptionFr`, `priceUnit`, `images`

```json
// Response 201 — Service object with category and provider included
```

---

## 4. المنتجات

### 📦 GET `/api/products` — قائمة المنتجات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| categoryId | string | تصفية حسب فئة |
| search | string | بحث في العنوان |
| minPrice | number | الحد الأدنى للسعر |
| maxPrice | number | الحد الأقصى للسعر |
| merchantId | string | تصفية حسب التاجر |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "title": "زيت زيتون",
    "titleFr": "Huile d'olive",
    "description": "زيت زيتون بكر ممتاز",
    "descriptionFr": "Huile d'olive extra vierge",
    "price": 2500,
    "stock": 50,
    "unit": "liter",
    "images": "/uploads/olive.jpg",
    "isAvailable": true,
    "rating": 4.8,
    "totalReviews": 25,
    "category": { "id": "...", "name": "أغذية", "nameFr": "Alimentation" },
    "merchant": {
      "id": "...",
      "name": "محمد",
      "nameFr": "Mohamed",
      "shopName": "متجر محمد",
      "shopNameFr": "Boutique Mohamed",
      "rating": 4.8,
      "hasDelivery": true
    }
  }
]
```

---

### 📦 POST `/api/products` — إضافة منتج جديد

```json
// Request Body
{
  "merchantId": "clx...",
  "categoryId": "clx...",
  "title": "زيت زيتون",
  "titleFr": "Huile d'olive",
  "description": "وصف المنتج",
  "descriptionFr": "Description du produit",
  "price": 2500,
  "stock": 50,
  "unit": "liter",
  "images": "/uploads/olive.jpg"
}
```

**Required:** `merchantId`, `categoryId`, `title`, `description`, `price`
**Optional:** `titleFr`, `descriptionFr`, `stock`, `unit`, `images`

---

## 5. المعدات

### 🚜 GET `/api/equipment` — قائمة المعدات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| status | string | `AVAILABLE` / `RENTED` / `MAINTENANCE` |
| ownerId | string | تصفية حسب المالك |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "title": "حفارة",
    "titleFr": "Excavatrice",
    "description": "حفارة صغيرة للبناء",
    "descriptionFr": "Mini excavatrice",
    "dailyPrice": 25000,
    "weeklyPrice": 150000,
    "monthlyPrice": 500000,
    "images": "/uploads/excavator.jpg",
    "status": "AVAILABLE",
    "rating": 4.5,
    "totalReviews": 8,
    "owner": {
      "id": "...",
      "name": "كريم",
      "nameFr": "Karim",
      "avatar": null,
      "rating": 4.5,
      "isVerified": true
    }
  }
]
```

---

### 🚜 POST `/api/equipment` — إضافة معدات جديدة

```json
// Request Body
{
  "ownerId": "clx...",
  "title": "حفارة",
  "titleFr": "Excavatrice",
  "description": "وصف المعدات",
  "descriptionFr": "Description",
  "dailyPrice": 25000,
  "weeklyPrice": 150000,
  "monthlyPrice": 500000,
  "images": "/uploads/excavator.jpg"
}
```

**Required:** `ownerId`, `title`, `description`, `dailyPrice`
**Optional:** `titleFr`, `descriptionFr`, `weeklyPrice`, `monthlyPrice`, `images`

---

## 6. الحجوزات

### 📅 GET `/api/bookings` — قائمة الحجوزات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| customerId | string | تصفية حسب العميل |
| providerId | string | تصفية حسب مقدم الخدمة |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "customerId": "clx...",
    "providerId": "clx...",
    "type": "SERVICE",
    "serviceId": "clx...",
    "equipmentId": null,
    "startDate": "2024-02-01T10:00:00.000Z",
    "endDate": null,
    "address": "سوق أهراس، حي النصر",
    "description": "إصلاح أنابيب المطبخ",
    "status": "PENDING",
    "totalPrice": 1500,
    "notes": "يرجى الإتياب في الصباح",
    "createdAt": "2024-01-30T00:00:00.000Z",
    "customer": { "id": "...", "name": "أحمد", "nameFr": "Ahmed", "phone": "..." },
    "provider": { "id": "...", "name": "محمد", "nameFr": "Mohamed", "phone": "..." },
    "service": {
      "id": "...",
      "title": "خدمة سباكة",
      "titleFr": "Service de plomberie",
      "category": { "name": "سباكة", "nameFr": "Plomberie" }
    },
    "equipment": null
  }
]
```

**حالات الحجز (Booking Status Flow):**
```
PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
  ↘       ↘           ↘
CANCELLED CANCELLED   CANCELLED
```

---

### 📅 POST `/api/bookings` — إنشاء حجز جديد

```json
// Request Body
{
  "customerId": "clx...",
  "providerId": "clx...",
  "type": "SERVICE",
  "serviceId": "clx...",
  "equipmentId": null,
  "startDate": "2024-02-01T10:00:00.000Z",
  "endDate": null,
  "address": "سوق أهراس، حي النصر",
  "description": "إصلاح أنابيب المطبخ",
  "totalPrice": 1500,
  "notes": "يرجى الإتياب في الصباح"
}
```

**Required:** `customerId`, `providerId`, `type` (`SERVICE`/`EQUIPMENT`), `startDate`, `totalPrice`
**Optional:** `serviceId`, `equipmentId`, `endDate`, `address`, `description`, `notes`

---

### 📅 PATCH `/api/bookings` — تحديث حالة الحجز

```json
// Request Body
{
  "id": "clx...",
  "status": "CONFIRMED",
  "notes": "تم التأكيد"
}
```

**Valid statuses:** `PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`

```json
// Error 400: { "error": "Cannot transition from PENDING to COMPLETED" }
```

---

## 7. الطلبات

### 🛒 GET `/api/orders` — قائمة الطلبات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| customerId | string | تصفية حسب العميل |
| merchantId | string | تصفية حسب التاجر |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "customerId": "clx...",
    "merchantId": "clx...",
    "productId": "clx...",
    "quantity": 3,
    "totalPrice": 7500,
    "status": "PENDING",
    "deliveryAddress": "سوق أهراس، حي 1 نوفمبر",
    "notes": "توصيل سريع من فضلك",
    "createdAt": "2024-01-30T00:00:00.000Z",
    "product": {
      "id": "...",
      "title": "زيت زيتون",
      "titleFr": "Huile d'olive",
      "category": { "name": "أغذية", "nameFr": "Alimentation" }
    },
    "customer": { "id": "...", "name": "أحمد", "phone": "..." },
    "merchant": { "id": "...", "name": "محمد", "shopName": "متجر محمد", "phone": "..." }
  }
]
```

**حالات الطلب (Order Status Flow):**
```
PENDING → PROCESSING → SHIPPED → COMPLETED
  ↘        ↘            ↘
CANCELLED CANCELLED    CANCELLED
```

---

### 🛒 POST `/api/orders` — إنشاء طلب جديد

```json
// Request Body
{
  "customerId": "clx...",
  "merchantId": "clx...",
  "productId": "clx...",
  "quantity": 3,
  "deliveryAddress": "سوق أهراس، حي 1 نوفمبر",
  "notes": "توصيل سريع"
}
```

**Required:** `customerId`, `merchantId`, `productId`, `quantity` (1-100)
**Note:** `totalPrice` يتم حسابه تلقائياً = `product.price × quantity`

---

### 🛒 PATCH `/api/orders` — تحديث حالة الطلب

```json
// Request Body
{
  "id": "clx...",
  "status": "PROCESSING",
  "notes": "جاري التحضير"
}
```

**Valid statuses:** `PENDING`, `PROCESSING`, `SHIPPED`, `COMPLETED`, `CANCELLED`

---

## 8. التقييمات

### ⭐ GET `/api/reviews` — قائمة التقييمات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| targetId | string | تصفية حسب المستخدم المستهدف |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "authorId": "clx...",
    "targetId": "clx...",
    "targetType": "USER",
    "rating": 5,
    "comment": "خدمة ممتازة!",
    "commentFr": "Excellent service!",
    "createdAt": "2024-01-30T00:00:00.000Z",
    "author": {
      "id": "...",
      "name": "أحمد",
      "nameFr": "Ahmed",
      "avatar": null
    }
  }
]
```

---

### ⭐ POST `/api/reviews` — إضافة تقييم جديد

```json
// Request Body
{
  "authorId": "clx...",
  "targetId": "clx...",
  "targetType": "USER",
  "rating": 5,
  "comment": "خدمة ممتازة!",
  "commentFr": "Excellent service!"
}
```

**Required:** `authorId`, `targetId`, `targetType`, `rating` (1-5)
**targetType:** `USER`, `SERVICE`, `PRODUCT`, `EQUIPMENT`
**Note:** يتم تحديث متوسط التقييم للمستخدم المستهدف تلقائياً

---

## 9. الرسائل

### 💬 GET `/api/messages` — قائمة المحادثات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| userId | string | ✅ **مطلوب** — ID المستخدم |
| otherUserId | string | إذا وُجد = رسائل محادثة محددة بين مستخدمين اثنين |

**بدون `otherUserId`** → قائمة كل المحادثات مع آخر رسالة:
```json
// Response 200 — Array
[
  {
    "otherUserId": "clx...",
    "otherUserName": "محمد",
    "otherUserNameFr": "Mohamed",
    "otherUserAvatar": null,
    "lastMessage": "مرحباً، كيف حالك؟",
    "lastMessageTime": "2024-01-30T12:00:00.000Z",
    "unreadCount": 2
  }
]
```

**مع `otherUserId`** → جميع رسائل المحادثة:
```json
// Response 200 — Array (مرتبة تصاعدياً)
[
  {
    "id": "clx...",
    "senderId": "clx...",
    "receiverId": "clx...",
    "content": "مرحباً",
    "isRead": true,
    "createdAt": "2024-01-30T11:00:00.000Z",
    "sender": { "id": "...", "name": "أحمد", "avatar": null },
    "receiver": { "id": "...", "name": "محمد", "avatar": null }
  }
]
```

---

### 💬 POST `/api/messages` — إرسال رسالة

```json
// Request Body
{
  "senderId": "clx...",
  "receiverId": "clx...",
  "content": "مرحباً، أريد الاستفسار عن الخدمة"
}
```

**Required:** `senderId`, `receiverId`, `content`
**Note:** لا يمكن إرسال رسالة لنفسك

---

### 💬 PATCH `/api/messages` — تحديد الرسائل كمقروءة

```json
// Request Body
{
  "userId": "clx...",
  "otherUserId": "clx..."
}
```

```json
// Response 200
{
  "success": true,
  "messagesMarked": 3
}
```

---

## 10. الشكاوى

### 🚨 GET `/api/complaints` — قائمة الشكاوى

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| userId | string | تصفية حسب المستخدم |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "userId": "clx...",
    "targetId": "clx...",
    "targetType": "SERVICE",
    "subject": "مشكلة في الخدمة",
    "subjectFr": "Problème avec le service",
    "description": "لم يأتِ الحرفي في الموعد المحدد",
    "descriptionFr": "L'artisan n'est pas venu au rendez-vous",
    "status": "PENDING",
    "adminReply": null,
    "adminReplyFr": null,
    "createdAt": "2024-01-30T00:00:00.000Z",
    "user": { "id": "...", "name": "أحمد", "email": "...", "phone": "..." }
  }
]
```

**Status values:** `PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`

---

### 🚨 POST `/api/complaints` — تقديم شكوى

```json
// Request Body
{
  "userId": "clx...",
  "targetId": "clx...",
  "targetType": "SERVICE",
  "subject": "مشكلة في الخدمة",
  "subjectFr": "Problème avec le service",
  "description": "لم يأتِ الحرفي في الموعد المحدد",
  "descriptionFr": "L'artisan n'est pas venu au rendez-vous"
}
```

**Required:** `userId`, `subject`, `description`
**Optional:** `targetId`, `targetType`, `subjectFr`, `descriptionFr`

---

### 🚨 PATCH `/api/complaints?action=reply` — رد المسؤول

```json
// Request Body + ?action=reply
{
  "id": "clx...",
  "adminReply": "نعتذر عن الإزعاج، سيتم اتخاذ الإجراءات اللازمة",
  "adminReplyFr": "Nous nous excusons pour le désagrément"
}
```

### 🚨 PATCH `/api/complaints?action=status` — تغيير حالة الشكوى

```json
// Request Body + ?action=status
{
  "id": "clx...",
  "status": "RESOLVED"
}
```

---

## 11. البحث

### 🔍 GET `/api/search` — بحث شامل

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | - | ✅ كلمة البحث (مطلوب) |
| type | string | `all` | `all` / `service` / `product` / `equipment` |
| category | string | - | تصفية حسب فئة |
| minPrice | number | - | الحد الأدنى للسعر |
| maxPrice | number | - | الحد الأقصى للسعر |
| minRating | number | - | الحد الأدنى للتقييم |
| available | string | - | `true` = المتاح فقط |
| sort | string | `rating` | `price-asc` / `price-desc` / `rating` / `newest` / `popular` |

```json
// Response 200
{
  "services": [
    {
      "id": "clx...",
      "type": "service",
      "title": "خدمة سباكة",
      "titleFr": "Service de plomberie",
      "description": "وصف...",
      "descriptionFr": "Description...",
      "price": 1500,
      "rating": 4.5,
      "totalReviews": 10,
      "isAvailable": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "category": "سباكة",
      "categoryFr": "Plomberie"
    }
  ],
  "products": [ /* same structure, type: "product" */ ],
  "equipment": [ /* same structure, type: "equipment" */ ],
  "total": 15
}
```

---

## 12. الفئات

### 📂 GET `/api/service-categories` — فئات الخدمات

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "name": "سباكة",
    "nameFr": "Plomberie",
    "icon": "🔧",
    "description": "خدمات السباكة",
    "descriptionFr": "Services de plomberie",
    "sortOrder": 1
  }
]
```

### 📂 POST `/api/service-categories` — إضافة فئة خدمات

```json
// Request Body
{
  "name": "كهرباء",
  "nameFr": "Électricité",
  "icon": "⚡",
  "description": "خدمات كهربائية",
  "descriptionFr": "Services électriques",
  "sortOrder": 2
}
```

### 📂 DELETE `/api/service-categories?id={id}` — حذف فئة

```json
// Response 200
{ "message": "Category deleted successfully", "deletedServicesCount": 3 }
```

### 📂 GET `/api/product-categories` — فئات المنتجات
### 📂 POST `/api/product-categories` — إضافة فئة منتجات
### 📂 DELETE `/api/product-categories?id={id}` — حذف فئة منتجات

*(نفس هيكل فئات الخدمات)*

---

## 13. الإشعارات

### 🔔 GET `/api/notifications?userId={userId}` — قائمة الإشعارات

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "userId": "clx...",
    "type": "system",
    "title": "ترحيب",
    "titleFr": "Bienvenue",
    "message": "مرحباً بك في DEAL!",
    "messageFr": "Bienvenue sur DEAL!",
    "link": null,
    "isRead": false,
    "createdAt": "2024-01-30T00:00:00.000Z"
  }
]
```

### 🔔 POST `/api/notifications` — إنشاء إشعار

```json
// Request Body
{
  "userId": "clx...",
  "type": "booking",
  "title": "حجز جديد",
  "titleFr": "Nouvelle réservation",
  "message": "تم استلام حجز جديد من أحمد",
  "messageFr": "Nouvelle réservation reçue de Ahmed",
  "link": "/dashboard/bookings"
}
```

### 🔔 PATCH `/api/notifications?id={id}` — تحديد كملوظ
### 🔔 PATCH `/api/notifications/read?userId={userId}` — تحديد الكل كمقروء

```json
// Response 200
{ "success": true, "notificationsMarked": 5 }
```

### 🔔 DELETE `/api/notifications?id={id}` — حذف إشعار

---

## 14. الإحصائيات

### 📊 GET `/api/stats` — إحصائيات المنصة

```json
// Response 200
{
  "users": {
    "total": 20,
    "customers": 3,
    "craftsmen": 8,
    "merchants": 5,
    "equipmentOwners": 3,
    "admins": 1
  },
  "services": 27,
  "products": 24,
  "equipment": 16,
  "bookings": 28,
  "orders": 15,
  "avgRating": 4.5,
  "pendingComplaints": 2,
  "recentUsers": [
    {
      "id": "clx...",
      "name": "أحمد",
      "nameFr": "Ahmed",
      "role": "CUSTOMER",
      "avatar": null,
      "createdAt": "2024-01-30T00:00:00.000Z"
    }
  ],
  "recentActivity": [
    {
      "id": "clx...",
      "type": "booking",
      "label": "Booking #abc123",
      "labelFr": "Réservation #abc123",
      "detail": "أحمد → محمد",
      "detailFr": "Ahmed → Mohamed",
      "status": "PENDING",
      "createdAt": "2024-01-30T00:00:00.000Z"
    }
  ]
}
```

---

## 15. الشهادات

### 💬 GET `/api/testimonials` — قائمة الشهادات

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| limit | number | تحديد العدد |
| featured | string | `true` = المميزة فقط |

```json
// Response 200 — Array
[
  {
    "id": "clx...",
    "authorName": "فاطمة",
    "authorNameFr": "Fatima",
    "role": "عميلة",
    "roleFr": "Cliente",
    "rating": 5,
    "content": "منصة ممتازة!",
    "contentFr": "Plateforme excellente!",
    "isFeatured": true,
    "createdAt": "2024-01-30T00:00:00.000Z"
  }
]
```

---

## 16. الإعدادات

### ⚙️ GET `/api/admin/settings` — إعدادات المنصة

```json
// Response 200
{
  "id": "clx...",
  "platformName": "DEAL",
  "contactEmail": "contact@deal.dz",
  "supportPhone": "+213 77 000 00 00",
  "maintenanceMode": false,
  "siteDescription": "منصة DEAL الرقمية",
  "siteDescriptionFr": "Plateforme numérique DEAL"
}
```

### ⚙️ PUT `/api/admin/settings` — تحديث الإعدادات

```json
// Request Body
{
  "platformName": "DEAL",
  "contactEmail": "contact@deal.dz",
  "supportPhone": "+213 77 000 00 00",
  "maintenanceMode": false,
  "siteDescription": "وصف المنصة",
  "siteDescriptionFr": "Description de la plateforme"
}
```

---

## 17. رفع الصور

### 📷 POST `/api/upload` — رفع صور

**Content-Type:** `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| images | File[] | ملفات الصور (واحد أو أكثر) |

```json
// Response 201
{
  "urls": ["/uploads/1706601234-a1b2c3.jpg", "/uploads/1706601234-d4e5f6.jpg"],
  "images": "/uploads/1706601234-a1b2c3.jpg,/uploads/1706601234-d4e5f6.jpg"
}
```

**Note:** الـ `images` string المفصولة بفواصل تُخزن مباشرة في حقول `images` في الخدمات/المنتجات/المعدات

---

## 18. اتصل بنا

### 📧 POST `/api/contact` — إرسال رسالة اتصال

```json
// Request Body
{
  "name": "أحمد",
  "email": "ahmed@email.com",
  "phone": "+213 77 000 00 00",
  "subject": "استفسار",
  "message": "أريد الاستفسار عن الخدمات",
  "recipientType": "craftsman",
  "recipientId": "clx..."
}
```

**Required:** `name`, `email`, `message`, `recipientId`
**recipientType:** `craftsman`, `merchant`, `equipment_owner`, `customer`, `admin`

---

## 19. Admin APIs

### 🛡️ GET `/api/admin/content?type={type}` — إدارة المحتوى

| type | Description |
|------|-------------|
| services | قائمة الخدمات مع تفاصيل المقدم |
| products | قائمة المنتجات مع تفاصيل التاجر |
| equipment | قائمة المعدات مع تفاصيل المالك |

**Optional:** `?search=كلمة`

### 🛡️ PATCH `/api/admin/content?type={type}&id={id}&field={field}&value={value}` — تحديث حقل

**Allowed fields per type:**
- services: `isAvailable`, `title`, `titleFr`, `description`, `descriptionFr`, `price`
- products: `isAvailable`, `title`, `titleFr`, `description`, `descriptionFr`, `price`, `stock`
- equipment: `status`, `title`, `titleFr`, `description`, `descriptionFr`, `dailyPrice`, `weeklyPrice`, `monthlyPrice`

### 🛡️ DELETE `/api/admin/content?type={type}&id={id}` — حذف محتوى

### 🛡️ DELETE `/api/admin/users/{id}` — حذف مستخدم

```json
// Response 200
{ "message": "User \"أحمد\" deleted successfully", "deletedUserId": "clx..." }
```
**Note:** لا يمكن حذف حسابات ADMIN (403)

---

## 20. نماذج البيانات

### User Model
```
User {
  id:            String   (cuid, auto)
  email:         String   (unique, required)
  password:      String   (required)
  name:          String   (required)
  nameFr:        String?
  phone:         String?
  role:          String   ("CUSTOMER" | "CRAFTSMAN" | "MERCHANT" | "EQUIPMENT_OWNER" | "ADMIN")
  avatar:        String?  (URL)
  bio:           String?
  bioFr:         String?
  city:          String   (default: "سوق أهراس")
  wilaya:        String   (default: "سوق أهراس")
  isVerified:    Boolean  (default: false)
  rating:        Float    (default: 0)
  totalReviews:  Int      (default: 0)
  specialties:   String?
  experience:    Int?
  hourlyRate:    Float?
  shopName:      String?
  shopNameFr:     String?
  hasDelivery:   Boolean  (default: false)
  isActive:      Boolean  (default: true)
  createdAt:     DateTime (auto)
  updatedAt:     DateTime (auto)
}
```

### Service Model
```
Service {
  id, title, titleFr, description, descriptionFr,
  categoryId → ServiceCategory,
  providerId → User,
  price (Float), priceUnit, images (String?),
  isAvailable (Boolean), rating, totalReviews,
  createdAt, updatedAt
}
```

### Product Model
```
Product {
  id, title, titleFr, description, descriptionFr,
  categoryId → ProductCategory,
  merchantId → User,
  price (Float), stock (Int), unit, images (String?),
  isAvailable (Boolean), rating, totalReviews,
  createdAt, updatedAt
}
```

### Equipment Model
```
Equipment {
  id, title, titleFr, description, descriptionFr,
  ownerId → User,
  dailyPrice (Float), weeklyPrice (Float?), monthlyPrice (Float?),
  images (String?), status ("AVAILABLE" | "RENTED" | "MAINTENANCE"),
  rating, totalReviews, createdAt, updatedAt
}
```

### Booking Model
```
Booking {
  id, customerId → User, providerId → User,
  serviceId → Service?, equipmentId → Equipment?,
  type ("SERVICE" | "EQUIPMENT"),
  startDate, endDate?, address?, description?,
  status ("PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"),
  totalPrice (Float), notes?, createdAt, updatedAt
}
```

### ProductOrder Model
```
ProductOrder {
  id, customerId → User, merchantId → User, productId → Product,
  quantity (Int), totalPrice (Float),
  status ("PENDING" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED"),
  deliveryAddress?, notes?, createdAt, updatedAt
}
```

### Review Model
```
Review {
  id, authorId → User, targetId → User,
  targetType ("USER" | "SERVICE" | "PRODUCT" | "EQUIPMENT"),
  rating (Int, 1-5), comment?, commentFr?, createdAt
}
```

### Message Model
```
Message {
  id, senderId → User, receiverId → User,
  content (String), isRead (Boolean), createdAt, updatedAt
}
```

### Complaint Model
```
Complaint {
  id, userId → User, targetId?, targetType?,
  subject, subjectFr?, description, descriptionFr?,
  status ("PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED"),
  adminReply?, adminReplyFr?, createdAt, updatedAt
}
```

### NotificationDb Model
```
NotificationDb {
  id, userId → User,
  type (String, default: "system"),
  title, titleFr?, message, messageFr?,
  link?, isRead (Boolean), createdAt
}
```

---

## 🔧 نصائح لتطبيق Android

### مثال Retrofit Interface (Kotlin):

```kotlin
interface DealApi {
    // Auth
    @POST("/api/auth/register")
    suspend fun register(@Body body: RegisterRequest): Response<UserResponse>

    @POST("/api/auth/login")
    suspend fun login(@Body body: LoginRequest): Response<UserResponse>

    // Services
    @GET("/api/services")
    suspend fun getServices(
        @Query("categoryId") categoryId: String? = null,
        @Query("search") search: String? = null,
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null
    ): Response<List<ServiceResponse>>

    @POST("/api/services")
    suspend fun createService(@Body body: CreateServiceRequest): Response<ServiceResponse>

    // Products
    @GET("/api/products")
    suspend fun getProducts(
        @Query("categoryId") categoryId: String? = null,
        @Query("search") search: String? = null,
        @Query("merchantId") merchantId: String? = null
    ): Response<List<ProductResponse>>

    // Equipment
    @GET("/api/equipment")
    suspend fun getEquipment(
        @Query("status") status: String? = null,
        @Query("ownerId") ownerId: String? = null
    ): Response<List<EquipmentResponse>>

    // Bookings
    @GET("/api/bookings")
    suspend fun getBookings(
        @Query("customerId") customerId: String? = null,
        @Query("providerId") providerId: String? = null
    ): Response<List<BookingResponse>>

    @POST("/api/bookings")
    suspend fun createBooking(@Body body: CreateBookingRequest): Response<BookingResponse>

    // Search
    @GET("/api/search")
    suspend fun search(
        @Query("q") query: String,
        @Query("type") type: String = "all",
        @Query("sort") sort: String = "rating",
        @Query("minPrice") minPrice: Double? = null,
        @Query("maxPrice") maxPrice: Double? = null
    ): Response<SearchResponse>

    // Messages
    @GET("/api/messages")
    suspend fun getConversations(@Query("userId") userId: String): Response<List<ConversationResponse>>

    @GET("/api/messages")
    suspend fun getChatMessages(
        @Query("userId") userId: String,
        @Query("otherUserId") otherUserId: String
    ): Response<List<MessageResponse>>

    @POST("/api/messages")
    suspend fun sendMessage(@Body body: SendMessageRequest): Response<MessageResponse>

    // Reviews
    @GET("/api/reviews")
    suspend fun getReviews(@Query("targetId") targetId: String): Response<List<ReviewResponse>>

    @POST("/api/reviews")
    suspend fun createReview(@Body body: CreateReviewRequest): Response<ReviewResponse>

    // Stats
    @GET("/api/stats")
    suspend fun getStats(): Response<StatsResponse>

    // Categories
    @GET("/api/service-categories")
    suspend fun getServiceCategories(): Response<List<CategoryResponse>>

    @GET("/api/product-categories")
    suspend fun getProductCategories(): Response<List<CategoryResponse>>
}
```

### مثال Upload بـ OkHttp:

```kotlin
fun uploadImages(files: List<File>): Call<UploadResponse> {
    val body = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
    files.forEach { file ->
        body.addFormDataPart("images", file.name, file.asRequestBody("image/*".toMediaType()))
    }
    return api.upload(body.build())
}
```

---

## 📱 حسابات تجريبية (Demo Accounts)

| الدور | البريد | كلمة المرور |
|-------|--------|-------------|
| عميل (Customer) | customer1@deal.dz | pass123 |
| حرفي (Craftsman) | craftsman1@deal.dz | pass123 |
| تاجر (Merchant) | merchant1@deal.dz | pass123 |
| صاحب معدات (Equipment Owner) | equip1@deal.dz | pass123 |
| مسؤول (Admin) | admin@deal.dz | admin123 |

---

**总计: 25 نقطة API — 19 نقطة عامة + 4 نقطة Admin + 2 نقطة Auth**

*تم إنشاء هذا المستند تلقائياً من خلال تحليل شفرة المصدر — آخر تحديث: 2025*
