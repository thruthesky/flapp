#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = __importStar(require("yargs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const convert = __importStar(require("xml-js"));
const ncp_1 = __importDefault(require("ncp"));
class App {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield this.parseFlappSettings()))
                return;
            this.newPackageName = this.settings['apps'][this.app]['AppId'];
            this.currentPackageName = yield this.getCurrentAndroidPackageName();
            console.log(`Current Package: ${this.currentPackageName}`);
            console.log(`New Package: ${this.newPackageName}`);
            try {
                yield this.patchAndroidAppId();
                yield this.patchAndroidGradle();
                yield this.patchAndroidKotlin();
                yield this.linkFiles();
                yield this.copyFolders();
                // await this.linkPubspec();
                // await this.linkInfoPlist();
                // await this.linkGoogleServiceJson();
                // await this.linkGoogleServiceInfoPlist();
                // await this.linkKeyProperties();
            }
            catch (e) {
                this.error(e);
            }
        });
    }
    error(msg) {
        console.log('============== Flapp Error ===============');
        console.log(msg);
        console.log('@see https://github.com/thruthesky/flutter-multi-apps');
    }
    parseFlappSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!yargs.argv.app) {
                this.error('Input app');
                return false;
            }
            else {
                this.app = yargs.argv.app;
            }
            this.projectPath = yargs.argv.path;
            if (!this.projectPath)
                this.projectPath = '.';
            const flappPath = path.join(this.projectPath, 'flapp.json');
            if (!fs.existsSync(flappPath)) {
                this.error(`Flapp configuration file does not exists at ${flappPath}`);
                return false;
            }
            this.settings = JSON.parse(fs.readFileSync(flappPath).toString());
            this.projectPubspecPath = path.join(this.projectPath, 'pubspec.yaml');
            this.newPubspecPath = path.join(this.projectPath, `lib/apps/${yargs.argv.app}/res/${yargs.argv.app}.pubspec.yaml`);
            if (!fs.existsSync(this.projectPubspecPath)) {
                this.error('You are not in Flutter project folder');
                return false;
            }
            if (!fs.existsSync(this.newPubspecPath)) {
                this.error(`${this.app} does not exists.`);
                return false;
            }
            return true;
        });
    }
    /**
     * Android 의 package name 을 가져온다.
     */
    getCurrentAndroidPackageName() {
        return __awaiter(this, void 0, void 0, function* () {
            const main = path.join(this.projectPath, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
            const mainXml = fs.readFileSync(main).toString();
            const mainXml2Json = convert.xml2json(mainXml, { compact: true, ignoreComment: true, spaces: 4 });
            const mainJson = JSON.parse(mainXml2Json);
            const currentPackage = mainJson['manifest']['_attributes']['package'];
            return currentPackage;
        });
    }
    /**
     * Android 의 Gradle 변경한다.
     */
    patchAndroidGradle() {
        return __awaiter(this, void 0, void 0, function* () {
            const gradlePath = path.join(this.projectPath, 'android', 'app', 'build.gradle');
            const gradleContent = fs.readFileSync(gradlePath).toString();
            const temp = gradleContent.replace(this.currentPackageName, this.newPackageName);
            fs.writeFileSync(gradlePath, temp);
            console.log('Patch Android Gradle');
        });
    }
    /**
     * Android 의 Kotlin 파일을 변경한다.
     */
    patchAndroidKotlin() {
        return __awaiter(this, void 0, void 0, function* () {
            const mainActivityPath = path.join(this.projectPath, this.settings['MainActivity']);
            const mainActivityPathContent = fs.readFileSync(mainActivityPath).toString();
            const temp = mainActivityPathContent.replace(this.currentPackageName, this.newPackageName);
            fs.writeFileSync(mainActivityPath, temp);
            console.log('Patch Android Kotalin Mainactivit');
        });
    }
    /**
     * Android 의 AppManifest.xml 들의 package 를 변경한다.
     */
    patchAndroidAppId() {
        return __awaiter(this, void 0, void 0, function* () {
            const main = path.join(this.projectPath, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
            const debug = path.join(this.projectPath, 'android', 'app', 'src', 'debug', 'AndroidManifest.xml');
            const profile = path.join(this.projectPath, 'android', 'app', 'src', 'profile', 'AndroidManifest.xml');
            const mainXml = fs.readFileSync(main).toString();
            const debugXml = fs.readFileSync(debug).toString();
            const profileXml = fs.readFileSync(profile).toString();
            let temp = mainXml.replace(this.currentPackageName, this.newPackageName);
            fs.writeFileSync(main, temp);
            temp = debugXml.replace(this.currentPackageName, this.newPackageName);
            fs.writeFileSync(debug, temp);
            temp = profileXml.replace(this.currentPackageName, this.newPackageName);
            fs.writeFileSync(profile, temp);
            console.log('Patch Android App Id');
        });
    }
    // async linkPubspec() {
    //     console.log('re-link pubspeck.yaml');
    //     const currentPubspec = fs.readFileSync(this.projectPubspecPath).toString();
    //     const currDoc = await yaml.safeLoad(currentPubspec);
    //     console.log('current app: ', currDoc['name'], currDoc['version']);
    //     const newPubspec = fs.readFileSync(this.newPubspecPath).toString();
    //     const newDoc = await yaml.safeLoad(newPubspec);
    //     console.log('new app: ', newDoc['name'], newDoc['version']);
    //     if (fs.existsSync(this.projectPubspecPath))
    //         fs.unlinkSync(this.projectPubspecPath);
    //     fs.linkSync(this.newPubspecPath, this.projectPubspecPath);
    //     console.log('success');
    // }
    // async linkInfoPlist() {
    //     console.log('re-link Info.plist');
    //     const src = path.join(this.projectPath, 'lib', 'apps', this.app, 'res', `${this.app}.Info.plist`);
    //     const dst = path.join(this.projectPath, 'ios', 'Runner', 'Info.plist');
    //     if (fs.existsSync(dst))
    //         fs.unlinkSync(dst);
    //     fs.linkSync(src, dst);
    //     console.log('success');
    // }
    // async linkGoogleServiceJson() {
    //     console.log('re-link google-services.json');
    //     const src = path.join(this.projectPath, 'lib', 'apps', this.app, 'res', `${this.app}.google-services.json`);
    //     const dst = path.join(this.projectPath, 'android', 'app', 'google-services.json');
    //     if (fs.existsSync(dst))
    //         fs.unlinkSync(dst);
    //     fs.linkSync(src, dst);
    //     console.log('success');
    // }
    // async linkGoogleServiceInfoPlist() {
    //     console.log('re-link GoogleService-Info.plist');
    //     const src = path.join(this.projectPath, 'lib', 'apps', this.app, 'res', `${this.app}.GoogleService-Info.plist`);
    //     const dst = path.join(this.projectPath, 'ios', 'Runner', 'GoogleService-Info.plist');
    //     if (fs.existsSync(dst))
    //         fs.unlinkSync(dst);
    //     fs.linkSync(src, dst);
    //     console.log('success');
    // }
    // async linkKeyProperties() {
    //     console.log('re-link key.properties');
    //     const src = path.join(this.projectPath, 'lib', 'apps', this.app, 'res', `${this.app}.key.properties`);
    //     const dst = path.join(this.projectPath, 'android', 'key.properties');
    //     if (fs.existsSync(dst))
    //         fs.unlinkSync(dst);
    //     fs.linkSync(src, dst);
    //     console.log('success');
    // }
    linkFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.settings['apps'][this.app];
            if (app['files'] !== void 0) {
                const files = app['files'];
                for (let f of Object.keys(files)) {
                    // console.log(f, '=>', files[f]);
                    const src = path.join(this.projectPath, f);
                    // console.log(src);
                    if (fs.existsSync(src)) { // 소스 파일이 존재하면
                        const dst = path.join(this.projectPath, files[f]);
                        // 목적 파일이 존재하면 삭제
                        if (fs.existsSync(dst)) {
                            fs.unlinkSync(dst);
                        }
                        // 링크를 건다
                        fs.linkSync(src, dst);
                        console.log(`Hard link: ${src} => ${dst}`);
                    }
                    else {
                        this.error(`Source: ${src} does not exist. abort!`);
                        break;
                    }
                }
            }
        });
    }
    copyFolders() {
        return __awaiter(this, void 0, void 0, function* () {
            const app = this.settings['apps'][this.app];
            if (app['folders'] !== void 0) {
                const files = app['folders'];
                for (let f of Object.keys(files)) {
                    const src = path.join(this.projectPath, f);
                    if (fs.existsSync(src)) {
                        const dst = path.join(this.projectPath, files[f]);
                        ncp_1.default(src, dst, { limit: 16 }, (err) => {
                            if (err) {
                                this.error(err);
                            }
                            else {
                                console.log(`Folder copied: ${src} => ${dst}`);
                            }
                        });
                    }
                    else {
                        this.error(`Folder Copy: Source: ${src} does not exist. abort!`);
                        break;
                    }
                    // if (fs.existsSync(src)) { // 소스 파일이 존재하면
                    //     const dst = path.join(this.projectPath, files[f]);
                    //     // 목적 파일이 존재하면 삭제
                    //     if (fs.existsSync(dst)) {
                    //         fs.unlinkSync(dst);
                    //     }
                    //     // 링크를 건다
                    //     fs.linkSync(src, dst);
                    //     console.log(`Hard link: ${src} => ${dst}`);
                    // } else {
                    //     this.error(`Source: ${src} does not exist. abort!`);
                    //     break;
                    // }
                }
            }
        });
    }
}
(new App()).run();
//# sourceMappingURL=index.js.map
