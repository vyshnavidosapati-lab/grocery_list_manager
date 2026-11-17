<<<<<<< HEAD
# Gather — Smart Grocery List Manager

Gather is a full-stack grocery planning app. Its React frontend talks to a Spring Boot REST API, which stores user-owned grocery items, categories, budgets, and reminders in MySQL. Authentication uses BCrypt-hashed passwords and signed JWT bearer tokens; grocery records are never stored in browser storage.

## Features

- Register, sign in/out, and edit profile details or password.
- Maintain grocery items with category, quantity, unit, price, priority, and purchase date; search, filter, sort, edit, delete, and toggle purchase status.
- Start with eight useful categories and add personal categories.
- Set a month-specific budget, see actual spending, remaining balance, and over-budget warnings.
- Create, edit, and delete reminders; overdue, upcoming, and completed reminders are grouped separately.
- Dashboard with current month totals, recent list activity, budget progress, and reminders.
- Insights charts for category spending, monthly spending, purchased vs. pending items, and budget utilization.
- Responsive layout with a light/dark theme toggle.
- Server-side ownership checks scope every grocery endpoint to the signed-in user.

## Technology

- **Frontend:** React 18, Vite, React Router, Axios, Chart.js.
- **Backend:** Java 25+, Spring Boot 3.5, Spring Web, Spring Data JPA, Spring Security, Bean Validation, JWT (JJWT), BCrypt, Maven.
- **Database:** MySQL 8+, Hibernate (`ddl-auto=update`).

## Folder structure

```text
frontend/
  src/
    components/       shared layout and protected-route components
    context/          authentication and notifications
    pages/            dashboard, items, categories, budget, reminders, insights, profile
    services/         Axios API client
    App.jsx
    main.jsx
    styles.css
  package.json
backend/
  src/main/java/com/smartgrocery/
    config/            CORS and stateless Spring Security
    controller/        REST endpoints
    dto/               validated API request/response records
    entity/            JPA entities
    exception/         API error responses
    repository/        Spring Data repositories
    security/          JWT service and request filter
    service/           application and analytics logic
  src/main/resources/application.properties
  pom.xml
database/schema.sql
README.md
```

## Requirements

- MySQL Server 8.x, running locally or reachable from the backend.
- Java 25 or newer and Maven 3.9+.
- Node.js 20+ and npm.

## Database setup

Create the database and an application user using an administrator account. Replace the example password with a strong local secret:

```sql
CREATE DATABASE IF NOT EXISTS grocery_manager
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'grocery_app'@'localhost' IDENTIFIED BY 'replace-with-a-strong-password';
GRANT ALL PRIVILEGES ON grocery_manager.* TO 'grocery_app'@'localhost';
```

`database/schema.sql` creates the database if needed. Hibernate creates and updates the six application tables (`users`, `grocery_lists`, `categories`, `grocery_items`, `budgets`, and `reminders`) on backend startup, including foreign keys. Configure the backend connection through `MYSQL_URL`, `MYSQL_USER`, and `MYSQL_PASSWORD`; the default URL targets local MySQL, and the default username is `grocery_app`. `JWT_SECRET` is required and must contain at least 32 bytes. `FRONTEND_ORIGIN` defaults to `http://localhost:5173`.

## Run the application

### 1. Start the backend

From the project root in PowerShell, set credentials for the MySQL user created above:

```powershell
$env:MYSQL_USER = "grocery_app"
$env:MYSQL_PASSWORD = "replace-with-a-strong-password"
$env:JWT_SECRET = "replace-with-a-random-secret-of-at-least-32-bytes"
mvn -f backend\pom.xml spring-boot:run
```

The API listens at `http://localhost:8080`. For another MySQL host or database, set `MYSQL_URL`, for example `jdbc:mysql://db-host:3306/grocery_manager?useSSL=false&serverTimezone=UTC`. `FRONTEND_ORIGIN` controls the single allowed browser origin and defaults to `http://localhost:5173`.

### 2. Start the frontend

In another terminal:

```powershell
Set-Location frontend
npm install
npm run dev
```

Open the Vite URL (normally `http://localhost:5173`). To point it to another API, create `frontend\.env.local` with:

```text
VITE_API_URL=http://localhost:8080/api
```

Create an account through the registration page. Each account starts with a private grocery list and the eight default categories. Only the JWT and minimal profile/theme preferences are kept in browser storage; all grocery application data is fetched from and persisted by the API.

### Production frontend build

```powershell
Set-Location frontend
npm run build
```

The built static site is written to `frontend\dist`. Set `VITE_API_URL` at build time if the deployed API is not at `http://localhost:8080/api`.

## REST API

All routes below (except registration and login) require `Authorization: Bearer <JWT>`. JSON request bodies use `Content-Type: application/json`.

| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register, create a private list and default categories; returns JWT and profile |
| POST | `/api/auth/login` | Sign in; returns JWT and profile |
| GET | `/api/users/me` | Read current profile |
| PUT | `/api/users/me` | Update username and email |
| PUT | `/api/users/me/password` | Change password after verifying the current password |
| GET, POST | `/api/categories` | List or add the current user's categories |
| GET | `/api/lists` | Get the current user's primary grocery list |
| GET | `/api/items?search=&category=&sort=name\|price` | Search/filter/sort the current user's grocery items |
| POST | `/api/items` | Add an item |
| PUT | `/api/items/{id}` | Edit an item |
| PATCH | `/api/items/{id}/status?purchased=true` | Mark purchased or pending |
| DELETE | `/api/items/{id}` | Delete an item |
| GET, PUT | `/api/budget?month=YYYY-MM` | Read or set a month's budget and spending totals |
| GET, POST | `/api/reminders` | List or create reminders |
| PUT, DELETE | `/api/reminders/{id}` | Edit or delete a reminder |
| GET | `/api/dashboard` | Dashboard totals and recent activity |
| GET | `/api/analytics` | Category, month, purchased/pending, and budget data |

Amounts are stored as decimal values. Purchased-item spending is calculated as unit price × quantity and attributed to the item's purchase month. Accessing or modifying another user's item/reminder returns not found rather than exposing whether it exists.

## Testing

1. Start MySQL and the backend with the environment configured above; verify the startup log reports a successful JPA/MySQL connection and the tables exist in `grocery_manager`.
2. Register at `/register`, refresh the browser, and verify the authenticated dashboard loads.
3. Add, edit, purchase, mark pending, search/filter/sort, and delete items on **My groceries**. Refresh and verify persisted changes.
4. Set a budget for the current month, mark an item purchased, and verify spending and remaining budget update.
5. Add/edit/delete reminders and check upcoming and overdue sections.
6. Add a second account. Use its token to request or modify the first account's item/reminder IDs; the API should return `404`.
7. Check `GET /api/analytics` and compare the totals with the saved purchased items.
8. Run `mvn -f backend\pom.xml test` and `npm run build` (from `frontend`) for backend tests and the production frontend build.

## Screenshots

Screenshots are not checked into this starter workspace. Capture the dashboard and responsive/mobile view after running the app and add the resulting images here.
=======
# grocery_list_manager
Grocery List Manager is a full-stack web application that helps users organize grocery shopping efficiently. It offers secure login, adding, editing and deleting items, tracking purchases, managing monthly budgets, setting reminders, and monitoring expenses through an interactive dashboard using React, Spring Boot, and MySQL.
>>>>>>> 35a9470498ec4d5e347d5ee8963e0f5c128b4c7f
