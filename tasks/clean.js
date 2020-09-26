import del from 'del';


const paths = [
    'build/**/*',
];

const clean = () => del(paths);
// const clean = done => del(paths, done);


export {
    clean,
};
