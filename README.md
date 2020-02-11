# Generator Varnode

Yeoman generator for:

* Express with KrakenJS
* Mongoose or Sequelize
* Customize Response Appender (Optional)
* CORS (Optional)
* Bare-bones ReactJS with Webpack and Babel

# Installation

As this is a yeoman generator, make sure you have yeoman installed:

  `npm install -g yo`
  
To install the generator:

  `npm install -g generator-varnode`
  
# Usage

  `cd /path/to/app/directory; yo varnode`
  
# Files & App Structure

    +-- app/
        |   +-- config/
            |   +-- config.json
            |   +-- development.json
            |   +-- production.json
        |   +-- controllers/
        |   +-- lib/
        |   +-- middlewares/
        |   +-- models/
        |   +-- seeders/
        |   +-- global-keys.js
        |   +-- server.js
        |   +-- index.js
    +-- .gitignore
    +-- .env
    +-- .eslintrc
    +-- .npmignore
    +-- .editorconfig
    +-- package.json
    +-- README.md

This generator is somewhat opinionated. You might be interested in knowing the following things about the way it sets the app.

## Sequelize

* It loads all the models on the variable `global.db`.
* While loading models, it converts snake cased file names found under `app/models` into camel case model name. For example, a file named `user_chats` will be available as `global.db.UserChats`.
* It allow you to excess all constants define in config.json, e.g,
you can see in config.json file there are multiple keys like `enums` and `errors` under `app` key, so it will place all enums and errors on global like this `global.appEnums` and `global.appErrors`.
* It also configure the Enviroment Variables by using .env file.

