import * as fs from "node:fs";
export default class Puzzle6 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {

        });
    }


    part1() {
        let result: number = 0;

        console.log(result);
    }

    part2() {
        let result: number = 0;

        console.log(result);
    }
}

