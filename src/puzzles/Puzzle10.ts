import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

const directions = [
    [0, -1], [1, 0], [0, 1], [-1, 0]
];

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: number[][];
    declare start: IPos[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];
        this.start = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line) => {
            if (line) {
                this.map.push(line.trim().split('').map((x) => parseInt(x)));
            }
        });

        this.map.forEach((xs, y) => {
            xs.forEach((num, x) => {
                if (num === 0) this.start.push({x: x, y: y});
            })
        });
    }

    part1() {
        let result = 0;

        for (const start of this.start) {
            let scores = new Map();
            this.move(0, start, scores);

            result += scores.size;
        }

        console.log(result);
    }

    part2() {
        let result = 0;

        for (const start of this.start) {
            result += this.move2(0, start);
        }

        console.log(result);
    }

    move(num: number, pos: IPos, scores: Map<string, boolean>) {
        if (num === 9) scores.set(`${pos.x}-${pos.y}`, true);
        else {
            directions.forEach((dir) => {
                let nextMove: IPos = {x: pos.x + dir[0], y: pos.y + dir[1]};
                if (this.isInBounds(nextMove) && this.map[nextMove.y][nextMove.x] === num + 1) {
                    this.move(num + 1, nextMove, scores);
                }
            })
        }
    }

    move2(num: number, pos: IPos) {
        if (num === 9) return 1;
        let cnt = 0;

        directions.forEach((dir) => {
            let nextMove: IPos = {x: pos.x + dir[0], y: pos.y + dir[1]};
            if (this.isInBounds(nextMove) && this.map[nextMove.y][nextMove.x] === num + 1) {
                cnt += this.move2(num + 1, nextMove);
            }
        })

        return cnt;
    }

    isInBounds(pos: IPos): boolean {
        return pos.x >= 0 && pos.x < this.map[0].length && pos.y >= 0 && pos.y < this.map.length;
    }
}



