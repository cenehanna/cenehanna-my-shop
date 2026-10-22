# Cenehanna Shop 🛍️

Hi! This is my first project in JavaScript and React: an online clothing store with a catalog, filters, a cart, favorites, and checkout.

The site is fully up and running here: https://cenehanna-shop.duckdns.org/

## 💡 How it was built

- **Design:** the interface design was made entirely by me in Figma.
- **Database:** PostgreSQL runs in a Docker container on a remote Oracle server. To fill the catalog, I used data from the [H&M Personalized Fashion Recommendations](https://www.kaggle.com/competitions/h-and-m-personalized-fashion-recommendations) dataset on Kaggle.
- **Deployment:** the site is deployed on an Oracle server configured with Nginx.
- **AI assistants:** while writing the code, I actively used AI assistants as advisors and mentors.

## 🛠️ Tech stack

- **Frontend:** Next.js, React, JavaScript, CSS Modules
- **Backend and DB:** Prisma ORM, PostgreSQL
- **Design:** Figma
- **Infrastructure:** Docker, Nginx, Oracle Cloud

## 📁 Project structure

```
cenehanna-shop/
├── prisma/        # Database schema, migrations
├── public/        # Static files and images
└── src/
    ├── app/       # Pages, API, and Server Actions
    ├── components/# Reusable UI components
    ├── hooks/     # Custom React hooks
    └── lib/       # DB queries, cart, favorites, and other logic
```

Thanks for stopping by!