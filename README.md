
# Agado Backend

This repository contains the backend code for the Agado flight booking platform. The backend is responsible for handling user authentication, flight data management, booking transactions, and administrative functions. This project is part of the CPE241 - Database System course at King Mongkut's University of Technology Thonburi (KMUTT).

## Features
* User Authentication: Stateless authentication using JWT and password encryption with bcrypt
* Data Management: CRUD operations for most of the data.
* Booking Management: Secure booking processing.

## Frontend Repository
The frontend for Agado is maintained in a seperate repository. You can find it [here](https://github.com/Encall/agado-frontend).

## Installation
#### Clone the project

```bash
  git clone https://github.com/Encall/agado-backend.git
```
#### Go to the project directory

```bash
  cd agado-backend
```

#### Install dependencies

```bash
  pnpm install
```

#### Set Up Environment Variables

Create a .env file in the root directory and add your environment variables:
```bash
DB_HOST=your_database_host
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
JWT_ACCESS_SECRET_KEY=your_jwt_secret
JWT_ACCESS_EXPIRATION=your_jwt_expiration ex. 1h, 1d, 1w, 1m, 1y
JWT_REFRESH_SECRET_KEY=your_jwt_refresh_secret
JWT_REFRESH_EXPIRATION=your_jwt_expiration ex. 1h, 1d, 1w, 1m, 1y
```
#### Run the Development Server
```bash
  pnpm run dev
```

## Docker
To run the backend in a Docker container

#### Build the Docker Image
```bash
  docker build -t encalls/adago-backend
```
#### Run the Docker Container
```bash
  docker run --name adago-backend -p 3000:3000 encalls/adago-backend
```

## Deployment
The backend is deployed on Amazon Elastic Container Service using a load balancer for scalability and Amazon Relational Database Service with read-replica support. Kubenetes is supported but not operational.
![Screenshot 2024-05-26 021548](https://github.com/user-attachments/assets/b85082a1-40d6-41c7-9f41-6155da1904d5)

## Project Structure
* **/src**: Contains the main source code for the application.
    * **/configs**: Contains configuration files for the application.
    * **/controllers**: Handles the request and response logic.
    * **/drizzle**: Defines the database schema.
    * **/middlewares**: Contains middleware functions for authentication and request processing.
    * **/routes**: Defines the API routes and their associated handlers.
    * **/schemas**:  Defines validation schemas and rules for request data.

## License
[MIT](https://choosealicense.com/licenses/mit/)
