# The Memory Game

This project contains an online gaming platform developed as part of the university course "Java and Web Development." The memory game is built with Vue 3 and Vite, and includes a server component, as well as database connection. For user authentication, Stytch is used.

If you wish to experience a short visual and auditive demonstration of the application from the user's point of view, you can open the video file `PJWD_Screencast.mov` in the `docs_phase3` folder.
In addition to explaining the registration process and introducing the user interface, the video demonstrates the click flow of the user to navigate the website, shows how to play the game, highlights the dark and light mode functionality as well as the responsive layout of the application, and presents the high score scene, among other things.

## Table of Contents

<!-- don't forget to update table of contents before committing on github -->

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Recommended IDE Setup](#recommended-ide-setup)
- [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Usage](#usage)
  - [Account Creation](#account-creation)
  - [Navigation](#navigation)
  - [Playing the Game](#playing-the-game)
  - [Scoring](#scoring)
  - [Profile](#profile)
- [Testing](#testing)
  - [Testing the Server and Database Code](#testing-the-server-and-database-code)
  - [Testing the Client-side Code](#testing-the-client-side-code)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [MariaDB](https://mariadb.org/download/) and configured it to be ready to be used (i. e. you now have a user(name) and a password for the databases to work with).
- You have created a [Stytch](https://stytch.com/) account.

## Installation

To install and run this project on your local machine, follow these steps:

1. Clone the repository to your local machine.
2. Set up your MariaDB databases:
   - Run the `setup.sql` script located in the `scripts` directory to create both the necessary main database and table, as well as the test database and table (please read the [Testing](#testing) section for further details on the testing process).
   - Ensure that your database user has the following privileges on the databases: `SELECT`, `INSERT`, `UPDATE`, `DELETE`, `CREATE`. These privileges are necessary for the application to interact with the databases.
3. Navigate to the `server` directory.
4. Copy the `.env.example` file to a new file named `.env` in the server folder.
5. Open the `.env` file and replace the placeholders with your Stytch credentials and database connection details as explained in the `.env.example` file.
6. Copy the `.env.test.example` file to a new file named `.env.test` in the server folder.
7. Open the `.env.test` file and replace the placeholders with your test database connection details as explained in the `.env.test.example` file
   (please read the [Testing](#testing) section for further details on the testing process).
8. Run `npm install` to install the server dependencies.
9. Navigate to the root project directory and run `npm install` to install the client dependencies.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Running the Project

To run the project:

1. Start the backend server by navigating to the `server` directory in the terminal and running `npm start`. By default, the server will start on port 3333. You can configure this by setting the `port` variable in the `server.js` file.
2. Start the client by navigating to the root project directory and running `npm run dev`. Vite will automatically choose a free port, usually starting from 3000.

After starting the server and client, you can access the application in your web browser. The URL will be printed in the console when you start the client. It will typically be `http://localhost:3000` (or a higher port number if 3000 was not available). You should see the login page of the application once you have entered the URL in the browser's address bar.

## Project Structure

<!-- must be updated again after writing the tests! -->

A high-level overview of the project's structure with the most important files and folders:

```
.
├── docs_phase3 # Screencast and additional documents for the university
│ └── PJWD_Screencast.mov # Screencast that demonstrates functionality of the application
├── public # Static files served directly by the server
│ ├── sounds # Sound files for the game
│ └── textures # Texture files for the game
├── scripts # Scripts to run to set up the databases
├── server # Database and server files, .env and .env.example file
│ ├── .env # Environment variables for the application to work
│ ├── .env.example # Example of how to set up the .env file
│ ├── .env.test # Environment variables for the tests to work
│ ├── .env.test.example # Example of how to set up the .env.test file
│ ├── database.js # File that handles SQL queries and establishes connection to database
│ ├── server.js # Server that handles backend logic and establishes connection to Stytch API
│ ├── database.test.js # Tests for the database connection
│ └── server.test.js # Unit tests for the server file
├── src # Source code for the project
│ ├── assets # Assets imported into the components
│ │ └── global.scss # Global styles for the project
│ ├── components # Vue components, only the navbar in this case
│ ├── router # Router folder
│ │ └── index.js # Vue router
│ ├── scenes # Game scenes
│ │ ├── BackgroundScene.js # Background of the game scenes of first two levels
│ │ ├── GameSceneL1.js # Source code of level 1
│ │ ├── GameSceneL2.js # Source code of level 2
│ │ ├── PreloadScene.js # Preloads all assets
│ │ └── StopwatchController.js # Stopwatch methods and properties of timer of game
│ ├── views # Vue components that make up the pages of the website
│ ├── App.vue # main Vue component, takes care of dark and light mode
│ ├── main.js # Entry point for the application
│ └── store.js # Vuex store configurations
├── tests # folder containing test cases
├── index.html # Main HTML file
├── LICENSE.txt # License file
└── README.md # This file
```

## Usage

This project consists of an online gaming platform for the game "Memory" and is currently only available in a development environment. Please follow the [installation](#installation) steps explained above to retrieve the URL under which the application is accessible on your local machine.

The application is responsive per se, i. e. the layout adapts to different viewport sizes, but since the keyboard is required to play the game, the application is not intended to run on mobile phones.

To gain a more vivid idea of the usage, take a look at the video file `PJWD_Screencast.mov` in the `docs_phase3` folder.

### Account Creation

A new user has to create an account by entering their email address and a password if they want to play the game. To be accepted, the password has to reach a minimum security score (3 out of 4), which is output to the user, and must be repeated in the confirmation field.

If the user already has an account, they can use the login form to log in with their email and password.

### Navigation

Upon successful login, the user is taken to the home page, from where they can navigate to the Game, Score, or Profile page. This navigation can either happen through the linked words on the home page or via the expandable navbar on the left-hand side of the screen. In addition, the navbar offers a button to toggle between dark and light mode, and a button that the user can click if they wish to log out.

On the Game page, the user is presented an instruction on how to control the game, textual feedback on their progress, and an overview over all levels in the form of thumbnails. The level structure is progressive, i. e. the user has to play level n to unlock level n+1. The locked levels are grayed out and are not navigable. The textual feedback on their progress updates with each level the user plays and displays different messages for the second-to-last and the last level.

### Playing the Game

Once the user clicks on a level, they are taken to the page on which they can play the respective level. The heading on the page indicates the level. The navbar stays accessible all the time so that the user can easily navigate back to the level overview or any other page.
To start the level, the user can either hit the enter key or the space bar, or click on the start button in the canvas.

The game itself is controlled by using either the arrow keys or the WASD keys to move the hero around the canvas and using the space bar to open the boxes. The objective is to find all matching animal images as quickly as possible by opening two boxes that contain two matching images in a sequence. The elapsed time is measured and shown to the user on top of the game canvas. A challenge is included through a ghost which hides in one of the boxes and freezes the user for 1.5 seconds. In level 2, two ghosts exist (but ghosts are not considered a match).

The user is supported in playing the game in an auditory manner by sounds that indicate matches and the different animals, as well as win or a new high score (refer to the video file `PJWD_Screencast.mov` in the `docs_phase3` folder for a short demonstration).

The high score for the level is shown above the game canvas if a high score already exists for the respective level.
Upon finding all matches, a win scene or a high score scene is shown, respectively.

### Scoring

The scores and high scores for each level can be viewed on the Scores page, which can be navigated to via the navbar. Each score is added automatically to the list of scores, and the high scores are automatically updated as well.

### Profile

On the Profile page, the user can see the email address they used to log in or register, and the date their account was created.

## Testing

This project includes a number of selected unit tests written using Jest and Supertest for the server-side and database related code, which can be executed using Node Package Manager (npm), and a number of selected behavior-driven scenarios for the client-side code, which need to be tested manually.

### Testing the Server and Database Code

Please make sure that at this point you have followed the [Installation](#installation) instructions and, especially, have set up your test database and filled in your `.env.test` file correctly.
To run the tests for the server-side code, including the database connection tests, follow these steps:

1. Navigate to the `server` directory in the terminal.
2. Ensure your test database is up and running, and your backend server is not running to avoid conflicts (you can stop your server by pressing `Control+C` in the terminal when you have navigated to the server folder).
3. Run `npm test` in the terminal. This will start Jest and run all test files in the `server` directory.

If any tests fail, Jest will provide information in the terminal about what caused the failure. Otherwise, a message by Jest in the terminal will indicate that the tests have passed, which should be the case given the original source code and setup of this project.

### Testing the Client-side Code

To test the client-side code, make sure your server and main database are up and running, and open the file `scenarios.md` which is located in the `tests` directory.
In this file, you will find a number of selected descriptions of what should happen when you (as the user) are on a specific page and perform a specific action.

Please navigate to the specified situation (indicated by the keyword "Given"), perform the specified action (indicated by the keyword "When"), and see if the specified outcome (indicated by the keyword "Then") occurs for each scenario.

## Contributing

This project is currently not open to contributions. It is a university project and is being developed solely by the author. However, feel free to explore the codebase and learn from it.

## License

This project is currently under MIT license. See the [LICENSE](./LICENSE.txt) file for more details.

The sounds used in this project are from Zapsplat. Please visit their [website](https://www.zapsplat.com/license-type/standard-license/) for licensing information.
