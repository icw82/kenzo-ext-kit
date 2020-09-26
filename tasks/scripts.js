import { resolve, relative, join } from 'path';
import { parallel, series, src, dest, watch } from 'gulp';
import chalk from 'chalk';
import del from 'del';
import ts from 'gulp-typescript';

import { sources, destination } from '../paths';


const tsProject = ts.createProject({
    alwaysStrict: true,
    baseUrl: 'sources',
    // importHelpers: true,
    isolatedModules: false,
    lib: [
        'esNext',
        'dom',
    ],
    target: 'es2019',
    // typeRoots: ['node_modules/@types']

    // declaration: true,
    // noImplicitReturns: true,
    // noUnusedParameters: false,
    // strict: true,

    // forceConsistentCasingInFileNames: true,
});

const globToSync = [
    './sources/**/*.ts',
];

const compile = () => src(globToSync)
    .pipe(tsProject())
    .pipe(dest(destination));


const scripts = series(
    compile,
);

const scriptsWatch = async() => {
    const watcher = watch(globToSync);

    watcher.on('change', path => {
        const file = chalk.blue(path);
        const event = chalk.blue('changed');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('add', path => {
        const file = chalk.greenBright(path);
        const event = chalk.greenBright('added');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('unlink', path => {
        const file = chalk.redBright(path);
        const event = chalk.redBright('removed');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('change', parallel(scripts));
    watcher.on('add', parallel(scripts));
    watcher.on('unlink', path => {
        const abs = resolve(path.replace(/.ts$/, '.js'));
        const rel = relative(sources, abs);
        const dest = join(destination, rel);

        return del(dest);
    });
};


export {
    scripts,
    scriptsWatch,
};
