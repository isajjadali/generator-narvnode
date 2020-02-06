/**
 * Created by shahqaan on 01/10/2016.
 */
const Generators = require('yeoman-generator');

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
        appModels: 'app/models/'
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
                message: 'Your Project Name',
                default: this.appname,
            },
            {
                type: 'input',
                name: 'description',
                message: 'Describe Your App',
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
            {
                type: 'confirm',
                name: 'shouldInstallDependencies',
                message: 'Would You Like To Install All Dependencies?',
                default: false,
            },
        ]);
        this.appname = this.answers.appname || this.appname;
        return this.answers;
    }

    installingDependencies() {
        if (this.answers.shouldInstallDependencies) {
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
                        "extract-text-webpack-plugin",
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
                        "typescript",
                    )
                    break;
                }
            }

            this.npmInstall(dependencies, { save: true });

            this.npmInstall(devDependencies, { saveDev: true });
        }
    }

    setupReact() {
        if (this.answers.frontend === Enums.react) {
            this.fs.copyTpl(
                this.templatePath('react/*'),
                this.destinationPath(''),
                this.getAnswers(),
            );

            this.fs.copyTpl(
                this.templatePath('react/.babelrc'),
                this.destinationPath('.babelrc'),
                this.getAnswers(),
            );

            this.fs.copyTpl(
                this.templatePath('react/client/*'),
                this.destinationPath('client/'),
                this.getAnswers(),
            );

            this.fs.copyTpl(
                this.templatePath('react/client/styles/*'),
                this.destinationPath('client/styles/'),
                this.getAnswers(),
            );
        }
    }

    setupAngular() {
        if (this.answers.frontend === Enums.angular) {
            this.fs.copyTpl(
                this.templatePath('angular/*'),
                this.destinationPath(''),
                this.getAnswers(),
            );

            this.fs.copy(
                this.templatePath('angular/client'),
                this.destinationPath('client/'),
                this.getAnswers(),
            );
        }
    }

    setupNode() {
        this.fs.copyTpl(
            this.templatePath('node/*'),
            this.destinationPath(''),
            this.getAnswers(),
        );

        this.fs.copy(
            this.templatePath('node/app/config/*'),
            this.destinationPath('app/config/'),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('node/app/controllers/*'),
            this.destinationPath('app/controllers/'),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('node/app/controllers/api/v1/*'),
            this.destinationPath('app/controllers/api/v1/'),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('node/app/lib/*'),
            this.destinationPath('app/lib/'),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('node/app/middlewares/*'),
            this.destinationPath('app/middlewares/'),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('node/app/middlewares/response/*'),
            this.destinationPath('app/middlewares/response/'),
            this.getAnswers(),
        );
    }

    setupMiddlewares() {
        if (this.answers.isCorsEnable) {
            this.fs.copyTpl(
                this.templatePath('cors/*'),
                this.destinationPath(Enums.paths.appConfig),
                this.getAnswers(),
            );
        }

        if (this.answers.isCustomizeResponseAppenderEnable) {
            this.fs.copyTpl(
                this.templatePath('customize-response-appender/*'),
                this.destinationPath(Enums.paths.appConfig),
                this.getAnswers(),
            );
        }
    }

    writing() {
        this.fs.copyTpl(
            this.templatePath(`${this.answers.db}/models/*`),
            this.destinationPath('app/models/'),
        );

        if (this.answers.db === Enums.sequelize) {
            const date = Math.floor(new Date().getTime() / 1000);
            this.fs.copyTpl(
                this.templatePath(`${Enums.sequelize}/migrations/create-users.js`),
                this.destinationPath(`app/migrations/${date}-create-users.js`),
            );

            this.fs.copyTpl(
                this.templatePath(`${Enums.sequelize}/seeders/create-users.js`),
                this.destinationPath(`app/seeders/${date}-create-users.js`),
            );

            this.fs.copyTpl(
                this.templatePath(`${Enums.sequelize}/database.js`),
                this.destinationPath(`${Enums.paths.appConfig}database.js`),
                this.getAnswers(),
            );

            this.fs.copyTpl(
                this.templatePath(`${Enums.sequelize}/.sequelizerc`),
                this.destinationPath('.sequelizerc')
            );
        } else if (this.answers.db === Enums.mongoose) {
            this.fs.copyTpl(
                this.templatePath(`${Enums.mongoose}/database.json`),
                this.destinationPath(`${Enums.paths.appConfig}database.json`),
                this.getAnswers(),
            );
        }

        this.fs.copyTpl(
            this.templatePath('*'),
            this.destinationPath(),
            this.getAnswers(),
        );

        this.fs.copyTpl(
            this.templatePath('.*'),
            this.destinationPath(),
            this.getAnswers(),
        );
    }
}
