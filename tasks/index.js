import { series, parallel } from 'gulp';

import { clean } from './clean';
import { immutable, immutableWatch } from './immutable';
import { scripts, scriptsWatch } from './scripts';
import { styles, stylesWatch } from './styles';


const build = series(
    immutable,
    parallel(
        scripts,
        styles,
    ),
);

const watch = series(
    immutableWatch,
    parallel(
        scriptsWatch,
        stylesWatch,
    )
);

const defaultTask = series(clean, build, watch);


export {
    clean,

    build,
    watch,

    defaultTask as default,
};
