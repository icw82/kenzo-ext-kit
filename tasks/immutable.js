import { resolve, relative, join } from 'path';
import { parallel, series, src, dest, watch } from 'gulp';
import replace from 'gulp-replace';
import debug from 'gulp-debug';
import rename from 'gulp-rename';
import changed from 'gulp-changed';
import { default as chalk } from 'chalk';
// import { default as ind } from 'indent-string';

import * as info from './../../package.json';
// import { rename } from 'fs';


const base = './immutable/';
const destination = 'build';
const globs = {
    // TODO: Автоматические распознавание текстовых файлов
    text: [
        '**/*.html',
        '**/*.css',
        '**/*.js',
        '**/*.json',
        '**/*.html',
    ].map(item => base + item),
};

// Остальные не текстовые файлы.
globs.rest = globs.text.map(item => '!' + item);
globs.rest.push(base + '**/*.*');

const text = () => src(globs.text)
    .pipe(replace(/::version::/g, info.version))
    .pipe(replace(/::author::/g, info.author))
    .pipe(debug({title: 'immutable → '}))
    .pipe(dest(destination));

const rest = () => src(globs.rest)
    .pipe(dest(destination));

const immutable = parallel(
    text,
    rest,
);

// FIXME: не работает вотчер

const watchLog = (file, event) => {
    console.log(`File ${ chalk.blue(file) } was ${ event }`);
};

const transfer = path => src(path)
    .pipe(rename(path => {
        path.dirname = relative(base, path.dirname);
    }))
    .pipe(replace(/::version::/g, info.version))
    .pipe(replace(/::author::/g, info.author))
    .pipe(dest(destination));

const textWatch = async () => {
    // const watcher =
    watch(globs.text, text);

    // TODO: Удаление в Clear

    // watcher.on('change', path => {
    //     watchLog(path, 'changed');
    //     transfer(path);
    // });
    // watcher.on('add', path => {
    //     watchLog(path, 'added');
    //     transfer(path);
    // });
    // watcher.on('unlink', path => {
    //     watchLog(path, 'removed');
    // //     [...settings.targets].forEach(item => {
    // //         const dest = join(
    // //             settings.resources,
    // //             relative(item, path)
    // //         );

    // //         if (is.link(dest)) {
    // //             readlink(dest, (error, linkString) => {
    // //                 if (!is.file(linkString)) {
    // //                     unlink(dest);
    // //                 }
    // //             });
    // //         }
    // //     });
    // });
};

const immutableWatch = parallel(
    textWatch,
    // restWatch,
);


export {
    immutable,
    immutableWatch,
};
