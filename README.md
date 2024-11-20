# Likeat - Restaurant Evaluation Platform

Likeat is a web application designed to allow users to manage, evaluate, and review restaurants. Built with a Java Spring Boot backend and a React-based frontend, the platform offers a smooth and responsive user experience. Restaurant owners can manage their listings, customers can leave reviews, and admins oversee all operations. A fair ranking algorithm ensures unbiased restaurant ratings.

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Usage](#usage)

## Features

- **Restaurant Management**: Restaurant owners can register, edit, and delete their restaurant listings.
- **User Roles**: Supports three types of users: restaurant owners, customers, and admins.
- **Restaurant Reviews**: Customers can leave reviews and rate restaurants.
- **Fair Ranking Algorithm**: A custom algorithm ensures that restaurant rankings are unbiased and fair, providing an accurate reflection of user reviews.
- **Admin Control**: Admins have full control over the system, including user management and restaurant approval.
- **Responsive Frontend**: The frontend is designed with React to ensure a responsive, user-friendly experience.

## Requirements

### Backend (Java-based)
- Java 11 or higher
- Maven 3.6.0+
- A relational database (MySQL, PostgreSQL, etc.)

### Frontend (React-based)
- Node.js 14.x or higher
- npm 6.x or higher

## Installation

### Backend Setup

1. Clone this repository to your local machine:

    ```bash
    git clone https://github.com/your-username/likeat.git
    ```

2. Navigate to the `backend-likeat` directory:

    ```bash
    cd Likeat/backend-likeat
    ```

3. Build the project using Maven:

    ```bash
    mvn clean install
    ```

4. Run the application:

    ```bash
    mvn spring-boot:run
    ```

### Frontend Setup

1. Navigate to the `frontend-likeat` directory:

    ```bash
    cd Likeat/frontend-likeat
    ```

2. Install the necessary dependencies:

    ```bash
    npm install
    ```

3. Start the React development server:

    ```bash
    npm start
    ```

## Usage

1. Access the backend API by navigating to `http://localhost:8080` once the Spring Boot application is running.
2. Access the frontend by navigating to `http://localhost:3000`.
3. Admin users can log in to manage restaurants, reviews, and users.
4. Restaurant owners can register their restaurants and manage their profiles.
5. Customers can browse restaurants, add reviews, and view others' feedback.
