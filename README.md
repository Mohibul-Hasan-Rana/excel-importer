# Excel Importer

A Laravel + React application for importing Excel files with validation and error reporting.

## Features
- Drag & drop Excel file upload (supports .xlsx, .xls, .csv)
- Validation for required fields
- Displays import summary and error details

## Installation

### 1. Clone the repository
```
git clone <your-repo-url>
cd excel-importer
```

### 2. Install PHP dependencies
```
composer install
```

### 3. Install Node.js dependencies
```
npm install
```

### 4. Set up environment variables
Copy `.env.example` to `.env` and update database and other settings as needed.
```
cp .env.example .env
```

### 5. Generate application key
```
php artisan key:generate
```

### 6. Run database migrations
```
php artisan migrate
```

### 7. Build frontend assets
```
npm run dev or npm run build or npx vite build
```
Or for development with hot reload:
```
npx vite
```

### 8. Start the Laravel server
```
php artisan serve
```

### 9. Access the app
Open your browser and go to `http://localhost:8000`

## Usage
- Upload an Excel file using the drag & drop area.
- View the import summary and validation errors.
- Download the error file if there are failed rows.

## Troubleshooting
- Make sure your database is configured and running.
- If you see blank pages, check your browser console for errors.
- Ensure all dependencies are installed and migrations are run.


