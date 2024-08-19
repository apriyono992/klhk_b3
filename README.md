# React + NestJS + Prisma/Sequelize + PostgreSQL Application

This is a full-stack application that uses React (with Material-UI) for the frontend and NestJS for the backend. It utilizes PostgreSQL as the database, and you can choose between Prisma or Sequelize as the ORM.

## Prerequisites

Before running the application, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/en/download/) (v14.x or later)
- [Yarn](https://classic.yarnpkg.com/en/docs/install)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Git](https://git-scm.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Install Dependencies

Go to the root directory and install the required dependencies:

```bash
yarn install
```

### 3. Set Up PostgreSQL

Make sure PostgreSQL is running, and create a new database for the application.

For example:

```bash
psql -U postgres
CREATE DATABASE mydatabase;
```

Replace `mydatabase` with the name of your database.

### 4. Configure Environment Variables

Go to `.env` file. Add the following environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/mydatabase"
```

Replace `username`, `password`, and `mydatabase` with your PostgreSQL credentials.

### 5. Initialize the Database

If using **Prisma**, run the following command to initialize the database and apply migrations:

```bash
cd api/
yarn prisma migrate dev --name init
```

### 6. Running the Application

To start both the frontend and backend applications in development mode, run:

```bash
yarn dev
```

This will start both the React frontend and NestJS backend, and automatically apply any pending database migrations.

- The React app will run on `http://localhost:3000`
- The NestJS app will run on `http://localhost:3001`

## Adding New Packages

To add a new package to either the frontend or backend, use `yarn` instead of `npm`. Here’s how to do it:

#### For the Backend

```bash
cd api/
yarn add <package-name>
```

#### For the Frontend

```bash
cd web/
yarn add <package-name>
```

### Example of Adding a Package

To install Axios in the frontend:

```bash
cd web/
yarn add axios
```

To install a PostgreSQL driver in the backend:

```bash
cd backend/nestjs-app
yarn add pg
```

## Troubleshooting

If you encounter any issues, try reinstalling the dependencies by removing the `node_modules` folder and running:

```bash
yarn install
```

If you need to reinitialize the database or run migrations, you can do so with:

```bash
yarn prisma migrate dev --name init  # For Prisma
```

Make sure your database credentials in the `.env` file are correct, and that PostgreSQL is running.

## License

This project is licensed under the MIT License.
```

### Penjelasan

- **Getting Started** memberikan instruksi tentang cara meng-clone repo, menginstall dependensi, mengatur PostgreSQL, dan menginisialisasi database.
- **Adding New Packages** menekankan penggunaan `yarn` untuk menambah paket.
- **Running the Application** menjelaskan cara menjalankan frontend dan backend secara bersamaan menggunakan `yarn dev`.
- **Database Setup** berisi instruksi untuk menginisialisasi database dengan Prisma.