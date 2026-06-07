# CaTinko

A full-stack web application built to simplify and digitize the price canvassing process. This tool allows users to securely log in, maintain a database of vendors and items, and compare product prices side-by-side to select the most cost-effective vendor for procurement.

## Features

* **Role-Based Access Control (RBAC):** Secure login system with distinct user roles and permissions:
  * **Admin:** Manages user accounts. Can add new users and reset passwords (passwords are securely hashed; the admin cannot view current passwords).
  * **Maker:** Responsible for the data entry phase. Creates, populates, and submits canvass lists. Has the ability to attach supporting documents/files to back up their canvass data.
  * **Approver:** Responsible for the review phase. Can review submitted canvass lists and either approve or reject them. Includes the ability to leave specific remarks when rejecting a canvass.
* **Master Data Management:** Dedicated modules to perform CRUD operations on:
  * **Vendors:** Track supplier details and contact information.
  * **Items:** Manage the catalog of products being purchased.
  * **Units of Measure (UoM):** Standardize quantities across the platform.
* **Canvass Management & File Uploads:** Create active canvass lists to group items needed for a specific purchase, complete with file upload capabilities for attaching necessary supporting documents.
* **Price Comparison:** Input prices from multiple vendors for the same item and compare them side-by-side.
* **Vendor Selection:** Award the purchase to a specific vendor based on the best value.
* **PDF Report Generation:** Upon the final approval of a canvass, users can export and download a comprehensive PDF document. This generated file features organized tables detailing:
  * The selected vendor(s)
  * Products to be purchased
  * Required quantities and Units of Measure (UoM)
  * Available vendor stock
  * Specific product remarks
  * Calculated total amount per product


## Setup
Ensure your local environment has the following installed:
* Node.js & npm
* Composer
* PHP 8.4.8+
* MySQL 9.3.0+

### Backend
1. ```cd backend```
2. ```composer install```
3. Copy the environment file and generate an app key:
   - ```cp .env.example .env```
   - ```php artisan key:generate```
5. Configure your .env file with your local database credentials.
6. Run database migrations:
   ```php artisan migrate:fresh --seed```
7. Start the Laravel development server:
   ```php artisan serve```

### Frontend
1. ```cd frontend```
2. ```npm install```
3. ```npm run dev```
