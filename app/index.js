/**
 * Created by shahqaan on 01/10/2016.
 */
const Generators = require('yeoman-generator');

const defaultPackageJsonScripts = {
    "start": "nodemon ./app/server.js | bunyan",
    "server-start": "nodemon ./app/server.js | bunyan --output short --color",
    "preinstall": "npm i -g concurrently nodemon",
}

const Enums = {
    sequelize: 'sequelize',
    mongoose: 'mongoose',
    react: 'react',
    angular: 'angular',
    none: 'none',
    migrations: 'migrations',
    seeders: 'seeders',
    paths: {
        appConfig: 'app/config/',
        appModels: 'app/models/',
        nodeApp: 'app/',
    }
};

class GeneratorsBase extends Generators {
    getAnswers() {
        return {
            db: this.answers.db,
            description: this.answers.description,
            frontend: this.answers.frontend,
            isCorsEnable: this.answers.isCorsEnable,
            isCustomizeResponseAppenderEnable: this.answers.isCustomizeResponseAppenderEnable,
            appname: this.answers.appname,
        };
    }

    executeFs(fsPaths = []) {
        fsPaths.forEach(path =>
            this.fs[path.ejsCompilationNotRequired ? 'copy' : 'copyTpl'](
                this.templatePath(path.templatePath),
                this.destinationPath(path.destinationPath),
                this.getAnswers(),
            )
        );
    }

    extendPackageJson(json = {}) {
        // Extend or create package.json file in destination path
        this.fs.extendJSON(this.destinationPath('package.json'), { ...json });
    }
}

module.exports = class extends GeneratorsBase {

    constructor(args, opts) {
        super(args, opts);
    }

    async prompting() {
        this.answers = await this.prompt([
            {
                type: 'input',
                name: 'appname',
                message: 'Your Project Name:',
                default: this.appname,
            },
            {
                type: 'input',
                name: 'description',
                message: 'Describe Your App:',
            },
            {
                type: 'list',
                name: 'db',
                message: 'Which ORM Would You Like To Use?',
                choices: [Enums.mongoose, Enums.sequelize],
            },
            {
                type: 'confirm',
                name: 'isCorsEnable',
                message: 'Would You Like To Use Cross-Origin Resource Sharing(CORS)?',
                store: true,
            },
            {
                type: 'confirm',
                name: 'isCustomizeResponseAppenderEnable',
                message: 'Would You Like To Use Customize Response Appender?',
                store: true,
            },
            {
                type: 'list',
                name: 'frontend',
                message: 'Which Frontend Framework Would You Like To Use?',
                choices: [Enums.react, Enums.angular, Enums.none],
                store: true,
            },
        ]);
        this.appname = this.answers.appname || this.appname;
        return this.answers;
    }

    installingDependencies() {
        const fsPaths = [
            {
                templatePath: 'package-json/*',
                destinationPath: '',
            },
        ];
        this.executeFs(fsPaths);

        const dependencies = [
            'bluebird',
            'bunyan',
            'construx-copier',
            'construx',
            'express',
            'kraken-js',
            'lodash',
            'moment',
            "crypto",
            "dotenv",
            "jquery",
            "jsonwebtoken",
            "rxjs",
            "tslib",
            "zone.js",
        ];

        const devDependencies = [
            'concurrently',
            'mocha',
            'nodemon',
            'supertest',
            "codelyzer",
            "eslint",
            "extract-text-webpack-plugin",
        ];

        switch (this.answers.db) {
            case Enums.mongoose: {
                dependencies.push(
                    Enums.mongoose,
                    "mongoose-delete",
                );
                break;
            }
            case Enums.sequelize: {
                dependencies.push(
                    'mysql',
                    'mysql2',
                    Enums.sequelize,
                );
                devDependencies.push('sequelize-cli');
                break;
            }
            default:
                break;
        }

        if (this.answers.isCorsEnable) {
            dependencies.push('cors');
        }

        if (this.answers.isCustomizeResponseAppenderEnable) {
            dependencies.push('customize-response-appender');
        }

        switch (this.answers.frontend) {
            case 'react': {
                dependencies.push(
                    'babel-core',
                    'babel-loader',
                    'babel-preset-es2015',
                    'babel-preset-react',
                    'react-dom',
                    'react',
                    "@babel/core",
                    "@babel/preset-env",
                    "@babel/preset-react",
                    "axios",
                    "babel-eslint",
                    "babel",
                    "compression-webpack-plugin",
                    "copy-webpack-plugin",
                    "css-loader",
                    "file-loader",
                    "html-loader",
                    "html-webpack-plugin",
                    "node-sass",
                    "raw-loader",
                    "sass-loader",
                    "style-loader",
                    "webpack-cli",
                    "webpack",
                    "extract-text-webpack-plugin@next",
                );
                break;
            }
            case 'angular': {
                dependencies.push(
                    "@angular/animations",
                    "@angular/common",
                    "@angular/compiler",
                    "@angular/core",
                    "@angular/forms",
                    "@angular/platform-browser-dynamic",
                    "@angular/platform-browser",
                    "@angular/router",
                    "tslib",
                );
                devDependencies.push(
                    "@angular-devkit/build-angular",
                    "@angular/cli",
                    "@angular/compiler-cli",
                    "@angular/language-service",
                    "@types/jasmine",
                    "@types/jasminewd2",
                    "@types/node",
                    "jasmine-core",
                    "jasmine-spec-reporter",
                    "karma-chrome-launcher",
                    "karma-coverage-istanbul-reporter",
                    "karma-jasmine-html-reporter",
                    "karma-jasmine",
                    "karma",
                    "protractor",
                    "ts-node",
                    "tslint",
                    "typescript@3.5.2",
                )
                break;
            }
        }

        this.npmInstall(dependencies, { save: true });
        this.npmInstall(devDependencies, { saveDev: true });
    }

    setupReact() {
        if (this.answers.frontend === Enums.react) {
            const fsPaths = [
                {
                    templatePath: 'react/*',
                    destinationPath: '',
                },
                {
                    templatePath: 'react/.babelrc',
                    destinationPath: '.babelrc',
                },
                {
                    templatePath: 'react/client/*',
                    destinationPath: 'client/',
                },
                {
                    templatePath: 'react/client/styles/*',
                    destinationPath: 'client/styles/',
                },
                {
                    templatePath: 'react/client/assets/*',
                    destinationPath: 'client/assets/',
                },
            ];
            this.executeFs(fsPaths);
        }
    }

    setupAngular() {
        if (this.answers.frontend === Enums.angular) {
            const fsPaths = [
                {
                    templatePath: 'angular/*',
                    destinationPath: '',
                },
                {
                    templatePath: 'angular/client',
                    destinationPath: 'client/',
                    ejsCompilationNotRequired: true
                },
            ];
            this.executeFs(fsPaths);
        }
    }

    setupNode() {
        const fsPaths = [
            {
                templatePath: 'app/*',
                destinationPath: 'app/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}config/*`,
                destinationPath: 'app/config/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}controllers/*`,
                destinationPath: 'app/controllers/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}controllers/api/v1/*`,
                destinationPath: 'app/controllers/api/v1/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}lib/*`,
                destinationPath: 'app/lib/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}middlewares/*`,
                destinationPath: 'app/middlewares/',
            },
            {
                templatePath: `${Enums.paths.nodeApp}middlewares/response/*`,
                destinationPath: 'app/middlewares/response/',
            },
        ];
        this.executeFs(fsPaths);
    }

    setupMiddlewares() {
        const fsPaths = [];

        if (this.answers.isCorsEnable) {
            fsPaths.push({
                templatePath: 'cors/*',
                destinationPath: Enums.paths.appConfig,
            });
        }

        if (this.answers.isCustomizeResponseAppenderEnable) {
            fsPaths.push({
                templatePath: 'customize-response-appender/*',
                destinationPath: Enums.paths.appConfig,
            });
        }

        this.executeFs(fsPaths);
    }

    createPackageJson() {
        let packageJson = {
            scripts: {
                ...defaultPackageJsonScripts,
            }
        };

        switch (this.answers.frontend) {
            case Enums.react: {
                packageJson.scripts = {
                    ...packageJson.scripts,
                    "build": "webpack -p",
                    "client-start": "webpack -d --watch",
                    "dev-start": "concurrently --kill-others \"npm run server-start\" \"npm run client-start\"",
                };
                break;
            }
            case Enums.angular: {
                packageJson.scripts = {
                    ...packageJson.scripts,
                    "ng": "ng",
                    "build": "ng build",
                    "prod-build": "ng build --prod",
                    "e2e": "ng e2e",
                    "test": "ng test",
                    "lint": "eslint ./app && ng lint",
                    "start": "npm run prod-build && node ./app/server.js | bunyan",
                    "client-start": "ng build --output-hashing=none --watch",
                    "dev-start": "concurrently --kill-others \"npm run server-start\" \"npm run client-start\"",
                };
                break;
            }
        }

        if (this.answers.db === Enums.sequelize) {
            packageJson.scripts = {
                ...packageJson.scripts,
                "migrate": "sequelize db:migrate | bunyan",
                "seeder": "sequelize db:seed:all | bunyan",
            };
        }

        this.extendPackageJson(packageJson);
    }

    writing() {
        let fsPaths = [
            {
                templatePath: `${this.answers.db}/models/*`,
                destinationPath: 'app/models/',
            },
            {
                templatePath: '*',
                destinationPath: '',
            },
            {
                templatePath: '.*',
                destinationPath: '',
            },
        ];

        if (this.answers.db === Enums.sequelize) {
            const date = Math.floor(new Date().getTime() / 1000);
            fsPaths = [
                ...fsPaths,
                {
                    templatePath: `${Enums.sequelize}/migrations/create-users.js`,
                    destinationPath: `app/migrations/${date}-create-users.js`,
                },
                {
                    templatePath: `${Enums.sequelize}/seeders/create-users.js`,
                    destinationPath: `app/seeders/${date}-create-users.js`,
                },
                {
                    templatePath: `${Enums.sequelize}/database.js`,
                    destinationPath: `${Enums.paths.appConfig}database.js`,
                },
                {
                    templatePath: `${Enums.sequelize}/.sequelizerc`,
                    destinationPath: '.sequelizerc',
                }
            ];
        }
        else if (this.answers.db === Enums.mongoose) {
            fsPaths.push({
                templatePath: `${Enums.mongoose}/database.json`,
                destinationPath: `${Enums.paths.appConfig}database.json`,
            });
        }

        this.executeFs(fsPaths);
    }
}
