import * as yargs from 'yargs';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';


class App {
    async run() {


        try {

            await this.patchPubspec();
        } catch (e) {
            console.error('Woops!');
            console.log(e);
        }
    }


    async patchPubspec() {
        const flutterRoot: string = yargs.argv.path as string;
        const pubspec = fs.readFileSync(path.join(flutterRoot, 'pubspec.yaml')).toString();
        const doc = await yaml.safeLoad(pubspec);

        console.log('current app: ', doc['name'], doc['version']);

        console.log('new app: ', yargs.argv.app);

    }
}

(new App()).run();


