# Simple Web Boilerplate

A minimal web boilerplate with the essentials

## Mission Statement

Our mission is to create web applications using pure web standards without unnecessary complexity. We embrace simplicity, avoiding build steps and trendy frameworks in favor of solid, standard JavaScript and Web Components.

## Goals & Philosophy

- **Web Standards Only**: We write vanilla JavaScript with ES Modules and Web Components
- **No Build Steps**: Deploy directly to Netlify without compilation or preprocessing
- **Object-Oriented Programming**: We structure our code using OOP principles
- **Test Driven Development**: All features are developed with tests first
- **Functional Testing**: We use Playwright for end-to-end testing of user journeys
- **Modern Environment**: Ubuntu 24, Node 23, and NPM 11
- **Chrome Focus**: We optimize for the latest version of Chrome
- **Component Architecture**: Custom Elements connect our JavaScript to HTML files
- **Testing Structure**: One test spec file per URL path, one test case per user journey

## Features

This boilerplate includes only the essentials:

-   📄 Basic HTML page
-   🧪 Simple testing with Playwright

## Getting Started

1. Install dependencies by running `npm install`
2. Start the development server with `npm start`

### Development Scripts

-   `npm start` - Start the development server
-   `npm run test` - Run Playwright tests

## Project Structure

-   `www/` - Website files
    -   `index.html` - Main HTML file
-   `test/` - Test files
    -   `index.spec.js` - Basic test for index.html
