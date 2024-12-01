import * as process from "node:process";

const day = parseInt(process.argv[2], 10);
const part = parseInt(process.argv[3], 10);
const example = process.argv[4] && process.argv[4] === 'e';

if (!day || day > 26 || day < 1) console.error('You need to provide number of day between 1 and 24');
else if (!part || part > 2 || part < 1) console.error('You need to provide part of the puzzle. 1 or 2');
else {
    const path = `./puzzles/Puzzle${day}.ts`;

    import(path).then((puzzle) => {
        const c = new puzzle.default(day, example);
        const m = `part${part}`

        c[m]();
    });
}
