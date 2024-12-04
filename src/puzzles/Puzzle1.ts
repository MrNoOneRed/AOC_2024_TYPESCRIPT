import * as fs from "node:fs";

export default class Puzzle1 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare left: number[];
    declare right: number[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;
        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const reg = /(\d+)/g;

        this.left = [];
        this.right = [];

        fileData.split(/\r?\n/).forEach(line =>  {
            let match: any;
            do {
                match = reg.exec(line);

                if(match) {
                    if(this.left.length === this.right.length) this.left.push(match[0]);
                    else this.right.push(match[0]);
                }
            }
            while (match);
        });
    }


    part1() {
        let result: number = 0;

        this.left.sort();
        this.right.sort();

        while(this.left.length) {
            const left = this.left.shift() ?? 0;
            const right = this.right.shift() ?? 0;
            const sum = Math.abs(left - right);

            result += sum;
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;

        while(this.left.length) {
            const left = this.left.shift() ?? 0;
            const rights = this.right.filter((right) => right === left);
            const sum = left * rights.length;

            result += sum;
        }

        console.log(result);
    }
}

