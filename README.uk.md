# Cenehanna Shop 🛍️

Привіт! Це мій перший проєкт на JavaScript та React: інтернет-магазин одягу з каталогом, фільтрами, кошиком, обраним та оформленням замовлення.

Сайт уже повністю працює і розгорнутий тут: https://cenehanna-shop.duckdns.org/

## 💡 Як усе створювалося

**Дизайн:** макет інтерфейсу повністю зроблений мною у Figma.
**База даних:** PostgreSQL працює в Docker-контейнері на віддаленому сервері Oracle. Для заповнення каталогу я використала дані з датасету [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations) з Kaggle.
**Деплой:** сайт розгорнутий на сервері Oracle, налаштованому через Nginx.
**ШІ-асистенти:** під час написання коду я активно користувалася їхньою допомогою як порадників і менторів.
## 🛠️ Технології

**Frontend:** Next.js, React, JavaScript, CSS Modules
**Backend і БД:** Prisma ORM, PostgreSQL
**Design:** Figma
**Infrastructure:** Docker, Nginx, Oracle Cloud
## 📁 Структура проєкту

cenehanna-shop/
├── prisma/        # Схема бази даних, міграції
├── public/        # Статичні файли та зображення
└── src/
    ├── app/       # Сторінки, API та Server Actions
    ├── components/# Багаторазові UI-компоненти
    ├── hooks/     # Кастомні React-хуки
    └── lib/       # Запити до БД, кошик, обране та інша логіка
Дякую, що зазирнули!