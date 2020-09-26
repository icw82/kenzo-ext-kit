import { resolve, relative, join } from 'path';
import { parallel, series, src, dest, watch } from 'gulp';
import less from 'gulp-less';
import chalk from 'chalk';
import del from 'del';

import { sources, destination } from '../paths';


const globToSync = [
    './sources/**/*.less',
];

const compile = () => src(globToSync)
    .pipe(less())
    .pipe(dest(destination));

const styles = series(
    compile,
);

const stylesWatch = async() => {
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

    watcher.on('change', parallel(styles));
    watcher.on('add', parallel(styles));
    watcher.on('unlink', path => {
        const abs = resolve(path.replace(/.less$/, '.css'));
        const rel = relative(sources, abs);
        const dest = join(destination, rel);

        return del(dest);
    });
};


export {
    styles,
    stylesWatch,
};
