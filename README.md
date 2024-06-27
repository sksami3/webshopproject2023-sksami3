
# Web Shop Project

## Developer Information

- **Name:** Sk Samiur Rahman
- **Emails:** sksami4456@gmail.com, samiur.rahman@abo.fi

## Project Overview

This project implements a fully functional web shop with backend and frontend components. All optional requirements have been implemented, including a feature that allows sellers to add items with multiple quantities, edit these quantities, and automatically categorize items as sold when all quantities are purchased.

## How to Run the Project

### Using Docker (Recommended)

This project includes a Docker setup for ease of deployment and consistency across different environments. To run the project using Docker, follow these steps:

1. Ensure Docker and Docker Compose are installed on your system.
2. Clone the repository and navigate to the project root.
3. Use the following Docker Compose command to build and start the services:
   ```sh
   docker-compose up --build
   ```
4. To pull the Docker images directly from Docker Hub, use:
   ```sh
   docker pull sksami3/web-shop-frontend:1.0.1
   docker pull sksami3/web-shop-backend:1.0.1
   ```

### Running Manually

If you prefer not to use Docker, you can run the project manually by setting up the backend and frontend separately:

#### Backend Setup

1. Install all dependencies listed in `requirements.txt`.
2. Run the backend server with:
   ```sh
   python manage.py runserver
   ```

#### Frontend Setup

1. Install all Node.js dependencies with:
   ```sh
   npm install
   ```
2. Start the frontend development server using:
   ```sh
   npm start nodemon server
   ```

## Additional Information

- The `root` folder of the project contains the `requirements.txt` file necessary for the backend setup.
- The `frontend` folder contains the `package.json` file listing all Node.js dependencies and includes both `src` and `build` folders for source files and production builds, respectively.
