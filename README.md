# React/Hapi Boilerplate (WIP)
A complete React/Hapi boilerplate: From environment settings to Redux actions (and everything between), using the latest (at least for this week) tech stack: React16, Hapi19, Webpack4, Babel7 etc. 

## Installation
  * Run `npm start` to launch the project in development environment (With webpack watch mode).
  * Run `npm run hmr` to launch the project in development environment with HMR (Auth does not work correctly).
  * Run `npm run prod` to launch the project in a production build.
  Requires Node >= 12

## Execution
  * Developer mode runs at [localhost:3001](http://localhost:3001)
  * Production mode runs at [localhost:9998](http://localhost:9998)
  * Swagger Documentation available at `/documentation` route

## Description
While examining the various React/Hapi boilerplates I didn't seem to find one that covered everything I had in mind. There were no Hapi19 examples, there was no Authotization boilerplate, the HMR examples were not covering production builds, I wanted the latest in compiling, and the list goes on. So I had to create this dense boilerplate to include most of the things someone could want from the current ecosystem.
