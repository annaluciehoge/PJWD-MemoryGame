At the time of the development of this project, the test tool vue-jest is only available in a stable version for Vue 2, and not for Vue 3, which has been used in this project.
Therefore, the documentation of a few selected behavior-driven test scenarios will for now have to suffice and can in the future be used as an entry point for the development of coded test cases.

<!-- template for Gherkin:
Feature: This is a high-level description of the functionality to be tested. It's usually a user-facing feature of your application.

Scenario: This is a specific situation or use case under the feature. There can be multiple scenarios for each feature.

Given: This part describes the initial context at the start of the scenario, such as the state of the system or the page the user is on.

When: This part describes the action that the user takes, such as clicking a button or entering text.

Then: This part describes the expected outcome after the action is taken. This is what you would assert in a test.

And: This keyword is used to chain multiple givens, whens, or thens together.
 -->

## Table of Contents

- [Feature: User Registration](#feature-user-registration)
  - [Scenario 1: Successful Registration](#scenario-1-successful-registration)
  - [Scenario 2: Unsuccessful Registration due to mismatched passwords](#scenario-2-unsuccessful-registration-due-to-mismatched-passwords)
  - [Scenario 3: Unsuccessful Registration due to incomplete form](#scenario-3-unsuccessful-registration-due-to-incomplete-form)
  - [Scenario 4: Unsuccessful Registration due to invalid email address](#scenario-4-unsuccessful-registration-due-to-invalid-email-address)
- [Feature: Password Strength Indicator](#feature-password-strength-indicator)
  - [Scenario 1: Password Strength Feedback](#scenario-1-password-strength-feedback)
  - [Scenario 2: Password Security Score](#scenario-2-password-security-score)
  - [Scenario 3: Password Visibility Toggle](#scenario-3-password-visibility-toggle)
- [Feature: User Login](#feature-user-login)
  - [Scenario 1: Successful Login with Button Click](#scenario-1-successful-login-with-button-click)
  - [Scenario 2: Successful Login with Enter Key](#scenario-2-successful-login-with-enter-key)
  - [Scenario 3: Unsuccessful Login](#scenario-3-unsuccessful-login)
- [Feature: Webpage Navigation](#feature-user-navigation)
  - [Scenario 1: Navbar Interaction](#scenario-1-navbar-interaction)
- [Feature: Dark and Light Mode](#feature-dark-and-light-mode)
  - [Scenario: Switching Between Modes](#scenario-switching-between-modes)
- [Feature: Level Navigation](#feature-level-navigation)
  - [Scenario 1: Navigate Level 1](#scenario-1-navigate-level-1)
  - [Scenario 2: Navigate Level 2](#scenario-2-navigate-level-2)
  - [Scenario 3: Last Level won](#scenario-3-last-level-won)
- [Feature: Scores and High Scores](#feature-scores-and-high-scores)
  - [Scenario 1: New Score](#scenario-1-new-score)
  - [Scenario 2: New High Score](#scenario-2-new-high-score)
- [Feature: Game Timing](#feature-game-timing)
  - [Scenario 1: Stopwatch Functionality](#scenario-1-stopwatch-functionality)

### Feature: User Registration

**Scenario 1: Successful Registration**

- Given the user is on the "Register" page
- When the user enters a valid email, password, and confirms the password
- And the user clicks the "Register" button
- Then the user should be redirected to the "Home" page
- And the user's data should be stored with Stytch

**Scenario 2: Unsuccessful Registration due to mismatched passwords**

- Given the user is on the "Register" page
- When the user enters a valid email, and two passwords that do not match
- And the user clicks the "Register" button
- Then the user should see an error message saying "Passwords do not match"
- And the user should remain on the "Register" page

**Scenario 3: Unsuccessful Registration due to incomplete form**

- Given the user is on the "Register" page
- When the user leaves one or more fields empty
- And the user clicks the "Register" button
- Then the user should see an error message saying "Please fill in all fields"
- And the user should remain on the "Register" page

**Scenario 4: Unsuccessful Registration due to invalid email address**

- Given the user is on the "Register" page
- When the user enters an email address in an invalid format
- And the user clicks the "Register" button
- Then the user should see an error message addressing the corresponding formatting issue
- And the user should remain on the "Register" page

### Feature: Password Strength Indicator

**Scenario 1: Password Strength Feedback**

- Given the user is on the "Register" page
- When the user starts entering a password
- Then the user should see a feedback message below the password entry field indicating how they can make their password more secure

**Scenario 2: Password Security Score**

- Given the user is on the "Register" page
- When the user enters a password
- Then the user should see a password security score in the form "Your current security score: X out of 4" (where 0 <= X <= 4)
- And the score should increase as their password gets more complex

**Scenario 3: Password Visibility Toggle**

- Given the user is on the "Register" page
- And the user has entered a password
- When the user clicks on the "eye" icon in the password field
- Then the user should be able to see the password they have entered
- And the icon should change to "eye-slash"
- When the user clicks on the "eye-slash" icon again
- Then the password should be hidden
- And the icon should change to "eye"

### Feature: User Login

**Scenario 1: Successful Login with Button Click**

- Given the user is on the "Login" page
- When the user enters a valid username and password
- And the user clicks the "Log in" button
- Then the user should be redirected to the "Home" page

**Scenario 2: Successful Login with Enter Key**

- Given the user is on the "Login" page
- When the user enters a valid username and password
- And the user presses the enter key
- Then the user should be redirected to the "Home" page

**Scenario 3: Unsuccessful Login**

- Given the user is on the "Login" page
- When the user enters an invalid username or password
- And the user clicks the "Log in" button
- Then the user should see an error message saying "Unauthorized Credentials"
- And the user should remain on the "Login" page
- And their input in the form should not be cleared automatically.

### Feature: Webpage Navigation

**Scenario 1: Navbar Interaction**

- Given the user has successfully logged in (or registered if it was a new user)
- And the user is on any page of the website
- When the user clicks on a navbar link
- Then the user should be redirected to the corresponding page

### Feature: Dark and Light Mode

**Scenario: Switching Between Modes**

- Given the user is on any page of the website
- When the user click the appearance button in the navbar
- Then the website should switch between dark and light mode
- And the button icon should switch from "sun" to "moon-stars" if the page was in dark mode and got switched to light mode, and from "moon-stars" to "sun" if the page was in light mode and got switched to dark mode

### Feature: Level Navigation

**Scenario 1: Navigate Level 1**

- Given the user is on the "Game" page
- And has not played any level yet
- Then level 1's thumbnail should be navigable
- And Level 2's thumbnail should be grayed out and not navigable
- And the text above the thumbnails should say: "Play level 1 to unlock the next level."
- When the user clicks on the thumbnail of level 1
- Then the "level 1" page should load
- And not display any high score
- And the user should be able to interact with the game (e. g. starting the game)

**Scenario 2: Navigate Level 2**

- Given the user is on the "Game" page
- And has played level 1 already
- Then both thumbnails should be navigable
- And the text above the thumbnails should say: "One more level to go! Play level 2 to finish all levels."
- When the user clicks on the thumbnail of level 2
- Then the "level 2" page should load
- And not display any high score
- And the user should be able to interact with the game (e. g. starting the game)

**Scenario 3: Last Level won**

- Given the user is on the "level 2" page
- And has won level 2
- When the user clicks on the "Game" link in the navbar to view the level overview
- Then the user should be redirected to the "Game" page
- And the text above the thumbnails should say: "Congratulations, you have played all levels! The deck is shuffled in each new round, so feel free to play each level again. Come back soon to check for new levels."
- And all levels should be navigable

### Feature: Scores and High Scores

**Scenario 1: New Score**

- Given the user has finished a level that they played at least one time before
- And they are on the page of that level
- And the new score is not shorter than the old score
- Then the win scene should be played
- When the user clicks on the "Scores" link in the navbar
- Then the user should be redirected to the "Scores" page
- And the new score should be listed for that level

**Scenario 2: New High Score**

- Given the user has finished a level
- And the new score is shorter than the old score, or the new score is the first score for this level
- Then the high score scene should be played
- And the new score should be displayed above the canvas
- When the user clicks on the "Scores" link in the navbar
- Then the user should be redirected to the "Scores" page
- And the new high score should be displayed for that level

### Feature: Game Timing

**Scenario 1: Stopwatch Functionality**

- Given the user is playing the game
- When the game starts
- Then the stopwatch should start timing the user's game play
- And the user should be able to see the elapsed time
