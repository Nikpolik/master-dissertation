# Visual Editor for Building SPAs

## Overview

Visual Editor for Building SPAs is a project that aims to provide a user-friendly and functional visual editor for creating single-page applications (SPAs). The editor leverages block-based programming techniques and integrates them with ReactJS to allow users to create simple Web Applications.

## Technology Stack

This project was built using combination backend and front-end technologies:

- **Frontend:** The front-end of this application is built using ReactJS, utilizing Material UI for design, RecoilJS for state management, and styled-components for additional CSS-in-JS styling capabilities.
- **Backend:** The backend is powered by Rust and Actix, a powerful actor system framework for Rust.
- **Database:** MongoDB is used as the database system to manage and store data efficiently.

For integration tests, Docker and Docker-compose tools are used to ensure that the application runs smoothly under different scenarios and configurations. The project uses GitHub Actions for CI/CD processes and Docker, Docker-compose for deployment.

## Demo

Before moving to the installation instructions, in case you just want to navigate inside the application and explore its functionalities, you can find it hosted at https://dissertation.npolikandriotis.com/

```
username: testuser
password: 123456
```

or create a new account at https://dissertation.npolikandriotis.com/

Additionally two demo websites have been created using the tools

1. https://dissertation.npolikandriotis.com/public/6aaf0290-56f4-4dc5-8196-26ad4a10cdc2
2. https://dissertation.npolikandriotis.com/public/c839b9da-e654-43bc-a2fb-f09fe794acf3

## Running the project

Here are the steps you need to follow to get the project up and running:

### Simple Installation

This project is containerized using Docker, which simplifies the installation process.

This is easiest way to run this project is by using Docker and the Docker images used for testing.

**Prerequisites:**

- Ensure ports 8888 and 8890 are free on your local machine as they are used for the frontend and backend respectively.
- Docker installed on your machine. You can find the installation guide [here](https://docs.docker.com/engine/install/).

**Installation Steps:**

1. Clone this repository by running `git clone https://github.com/Nikpolik/master-dissertation.git` in your terminal.

2. Navigate to the test directory with `cd test`.

3. Build and run the Docker containers. You can do this by running `docker compose up --build` in your terminal. If you're on a Unix-like environment, you can use the provided script by running `./run.sh`.

This process will download and run a MongoDB image, build and run the frontend and backend applications, and seed the database with some initial data.

After the installation is done, open your browser and navigate to http://localhost:8888'

You can then log in using the following credentials:

```
username: testtest
password: test
```

**IMPORTANT**

The test environment does not persist changes to the database.

### Development Installation instructions

To create a customized installation you need to build the front-end and the backend from scratch and also run a mongodb instance.

First clone this repository by running `git clone https://github.com/Nikpolik/master-dissertation.git` in your terminal.

#### Backend

**Prerequisites:**

- Install rust and the cargo build system. https://doc.rust-lang.org/cargo/getting-started/installation.html
- Have port 8080 available on your system.

**Installation Steps:**

1. Move to backend directory `cd backend`
2. Create a .env file that will hold enviroment variables
3. Then run `cargo-watch --ignore <filepath>/ -x run`.

Example .env

```bash
PORT=8080 # The port to bind the server.
FILE_PATH=./files # Location for storing and reading media assets.
SECRET=A_SUPER_SECRET_SECRET # Secret used to encrypt and decrypt JWT authentication header.
MONGO_URI=mongodb://MONGOURI=mongodb://dev:dev@mongodb:27017 # Mongodb uri, it should also include any authentication information required.
```

### Frontend

The front-end or client side of the application was bootstrapped using create-react-app (CRA).

**prerequisites:**

- install nodejs https://nodejs.org/en/download
- install yarn https://classic.yarnpkg.com/lang/en/docs/install
- Have port 3000 available on your system

**Installation Steps:**

1. Move to the front-end directory `cd front`
2. Run `yarn install` to install all dependencies
3. Run `yarn dev` this will start the application in development mode and make it available on http://localhost:3000

### Backend

**Prerequisites:**

- Install rust and the cargo build system https://doc.rust-lang.org/cargo/getting-started/installation.html

**Installation Steps:**

1. Move to backend directory `cd backend`
2. Then run `cargo build --release`.
   By default rust will build only for your current enviroment. If you want to target a different platform use the --target
   You can find all available build targets in rusts [platform support page](https://doc.rust-lang.org/nightly/rustc/platform-support.html)
   This make take a while since rust compiles all dependencies of the project from scratch.
3. After the build command is finished you can find the binary inside the target directory `backend/target/release`
4. Finally simple run the backend binary. Its important to provide all the necessary configurations through the following enviroment variables.

```bash
PORT=8080 # The port to bind the server.
FILE_PATH=./files # Location for storing and reading media assets.
SECRET=A_SUPER_SECRET_SECRET # Secret used to encrypt and decrypt JWT authentication header.
MONGO_URI=mongodb://MONGOURI=mongodb://dev:dev@mongodb:27017 # Mongodb uri, it should also include any authentication information required.
```

#### Frontend

The front-end or client side of the application was bootstrapped using create-react-app (CRA).

**prerequisites:**

- install nodejs https://nodejs.org/en/download
- install yarn https://classic.yarnpkg.com/lang/en/docs/install

**Installation Steps:**

1. Move to the front-end directory `cd front`
2. Run `yarn install` to install all dependencies
3. Run `REACT_APP_SERVER_URL=<my-server-url> yarn build`
4. After the build command is finished, inside the `front/build` folder a index.html file can be found along with all javascript and css sources. These must be served using your choise of webserver like [nginx](https://www.nginx.com/) or [apache](https://httpd.apache.org/).

## Usefull Information

## Directory Structure

The repository is structured as follows:

```
.
├── README.md           # Project overview and setup guide
├── backend             # Backend application code and related files
│   └── src
│       ├── api         # Endpoints and API logic
│       ├── auth.rs     # Middleware for user authentication (token encryption/decryption)
│       ├── files.rs    # Handles file upload logic
│       ├── main.rs     # Main entry point for the backend
│       ├── models      # Database Models
│       ├── repositories # Data Access Objects (DAOs) for each model
│       └── settings.rs  # Reads and initializes configurations from the environment
├── docker              # Docker-related files for deployment and testing
├── front               # Frontend application code and related files
│   └── src
│       ├── App.tsx     # Root component for the React application
│       ├── auth        # Components and logic related to authentication
│       ├── blocks      # Block-based programming components
│       ├── common      # Commonly used components and functions
│       ├── components  # Reusable UI components
│       ├── core        # Core functionality of the app
│       ├── editor      # Components and logic for the visual editor
│       ├── globalStyles.ts # Global styles applied across the app
│       ├── index.tsx   # Main entry point for the front-end
│       ├── media       # Media files used in the project
│       ├── pages       # Route-specific page components
│       ├── react-app-env.d.ts # Type definitions for Create React App
│       └── render      # Components and logic for rendering SPAs
└── test                # Test scripts and related files
```

In the `backend/src` directory:

- **api:** This directory contains all the endpoints and related API logic.
- **auth.rs:** This file manages middleware for user authentication. It takes care of token encryption and decryption.
- **files.rs:** This file is responsible for handling file upload logic.
- **main.rs:** This file serves as the main entry point for the backend application.
- **models:** This directory contains all the database models used in the application.
- **repositories:** This directory holds the Data Access Objects (DAOs) for each model.
- **settings.rs:** This file reads and initializes configurations and environment settings for the backend application.

In the `front/src` directory:

- **App.tsx:** This is the root component for the React application.
- **auth:** This directory holds all components and logic related to authentication.
- **blocks:** This directory contains all the block-based programming components used in the editor.
- **common:** This directory houses all commonly used components and utility functions.
- **components:** This directory contains all reusable UI components.
- **core:** This directory contains core functionality and logic of the app.
- **editor:** This directory hosts all components and logic related to the visual editor.
- **globalStyles.ts:** This file contains global styles applied across the application.
- **index.tsx:** This file serves as the main entry point for the frontend application.
- **media:** This directory holds all the media files used in the project.
- **pages:** This directory contains all the route-specific page components.
- **react-app-env.d.ts:** This file contains type definitions for Create React App.
- **render:** This directory holds all components and logic responsible for rendering the SPAs.
