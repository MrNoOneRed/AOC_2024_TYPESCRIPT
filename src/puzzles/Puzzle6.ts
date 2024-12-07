import * as fs from "node:fs";

const directions = [
    [0, -1], [1, 0], [0, 1], [-1, 0]
];

export default class Puzzle6 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: string[][];
    declare start: number[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];

        this.parseInput();
        this.start = this.findStartPosition();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            this.map[y] = [];

            for (let i = 0; i < line.trim().length; i++) {
                this.map[y].push(line.substring(i, i + 1));
            }
        });
    }


    part1() {
        let result: [string[], boolean] = [[], false];

        result = this.getMoves();

        console.log(result[0].length);
    }

    part2() {
        let result: number = 0;

        let moves = this.getMoves()[0];
        moves.shift();

        for (const move of moves) {
            const block = move.split('-').map((p) => parseInt(p));

            if(this.getMoves(block)[1]){
                result++;
            }
        }

        console.log(result);
    }

    findStartPosition() {
        let result: number[] = [0, 0];

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === '^') return [x, y];
            }
        }

        return result;
    }

    getMoves(loop: number[] | null = null): [string[], boolean] {
        let pos = [...this.start];
        let dirs = [...directions];
        let moves: string[] = [];
        let history: string[] = [];

        while (pos && !this.isOutOfBounds(pos)) {
            const posId = this.getPosId(pos);

            if (!moves.includes(posId)) moves.push(posId);

            const nextPos = [pos[0] + dirs[0][0], pos[1] + dirs[0][1]];

            if (!this.isOutOfBounds(nextPos) && this.map[nextPos[1]][nextPos[0]] === '#' || (loop && nextPos[0] === loop[0] && nextPos[1] === loop[1])) {
                const firstDir = dirs.shift();

                if (firstDir) dirs.push(firstDir);
            } else pos = nextPos;

            if(loop) {
                const posDirId = this.getPosId(pos, dirs[0]);

                if (history.includes(posDirId)) {
                    return [moves, true];
                }
                else history.push(posDirId);
            }
        }

        return [moves, false]
    }

    isOutOfBounds(pos: number[]): boolean {
        return pos[0] < 0 || pos[0] >= this.map[0].length || pos[1] < 0 || pos[1] >= this.map.length;
    }

    getPosId(pos: number[], dir: number[] | null = null) {
        return dir ? `${pos[0]}-${pos[1]}|${dir[0]}-${dir[1]}` : `${pos[0]}-${pos[1]}`;
    }
}

