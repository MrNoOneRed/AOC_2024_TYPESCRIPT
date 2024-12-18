import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface IPath {
    path: string,
    score: number
}

interface IQueue {
    pos: IPos,
    dir: number,
    score: number,
    path?: string
}

const directions: Record<number, IPos> = {
    0: {x: 0, y: -1},
    1: {x: 1, y: 0},
    2: {x: 0, y: 1},
    3: {x: -1, y: 0}
};

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: string[][];
    declare start: IPos;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                const xs = line.trim().split('');
                const s = xs.indexOf('S');
                this.map[y] = xs;

                if (s >= 0) this.start = {x: s, y: y};
            }
        });
    }

    part1() {
        const scores: Record<string, number> = {};
        let queue: IQueue[] = [{pos: this.start, dir: 1, score: 0}];
        let result = Infinity;

        while (queue.length) {
            const newQueue: IQueue[] = [];

            for(const q of queue) {
                const cKey = this.getId([q.pos.x, q.pos.y, q.dir]);
                const symbol = this.getSymbol(q.pos);

                if(this.isOutOfBounds(q.pos) || symbol === '#' || scores[cKey] < q.score) continue;

                scores[cKey] = q.score;

                if(symbol === 'E') {
                    if(q.score < result) result = q.score
                    continue;
                }

                const nextDirections: number[] = [q.dir, (q.dir + 1) % 4, (q.dir + 3) % 4];

                for(const nextDirection of nextDirections) {
                    const dir = directions[nextDirection];
                    newQueue.push({
                        pos: {
                            x: q.pos.x + dir.x,
                            y: q.pos.y + dir.y
                        },
                        dir: nextDirection,
                        score: q.score + (q.dir === nextDirection ? 1 : 1001)
                    });
                }
            }

            queue = newQueue;
        }

        this.draw();

        console.log(result);
    }

    part2() {
        const scores: Record<string, number> = {};
        const paths: IPath[] = [];
        let queue: IQueue[] = [{pos: this.start, dir: 1, score: 0, path: ''}];
        let result = Infinity;

        while (queue.length) {
            const newQueue: IQueue[] = [];

            for(const q of queue) {
                let path = q.path ?? '';
                const cKey = this.getId([q.pos.x, q.pos.y, q.dir]);
                const symbol = this.getSymbol(q.pos);

                if(this.isOutOfBounds(q.pos) || symbol === '#') continue;

                const pKey = this.getId([q.pos.x, q.pos.y]);
                path += `${pKey}|`;

                if(scores[cKey] && scores[cKey] < q.score) continue;

                scores[cKey] = q.score;

                if(symbol === 'E') {
                    paths.push({path: path, score: q.score});
                    if(q.score < result) result = q.score
                    continue;
                }

                const nextDirections: number[] = [q.dir, (q.dir + 1) % 4, (q.dir + 3) % 4];

                for(const nextDirection of nextDirections) {
                    const dir = directions[nextDirection];
                    newQueue.push({
                        pos: {
                            x: q.pos.x + dir.x,
                            y: q.pos.y + dir.y
                        },
                        dir: nextDirection,
                        score: q.score + (q.dir === nextDirection ? 1 : 1001),
                        path: path
                    });
                }
            }

            queue = newQueue;
        }

        const unique: Set<string> = new Set();
        const bestPaths = paths.filter((path) => path.score === result);

        for (const path of bestPaths) {
            const tiles = path.path.split("|");
            for (const tile of tiles) {
                if (tile === '') continue;
                unique.add(tile);
            }
        }

        this.draw();

        console.log(unique.size);
    }

    draw() {
        for (let y = 0; y < this.map.length; y++) {
            console.log(this.map[y].join(''));
        }
    }

    getSumPos(left: IPos, right: IPos): IPos {
        return {x: left.x + right.x, y: left.y + right.y}
    }

    getSymbol(pos: IPos) {
        return this.map[pos.y][pos.x];
    }

    isOutOfBounds(pos: IPos) {
        return pos.x < 0 || pos.x >= this.map[0].length || pos.y < 0 || pos.y >= this.map.length;
    }

    getId(elements: string[] | number[], delimiter: string = ',') {
        return `${elements.join(delimiter)}`;
    }
}



