import * as fs from "node:fs";
export default class Puzzle11 implements PuzzleInterface {
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

        fileData.split(/\r?\n/).forEach((line) => {

        });
    }

    part1() {
        console.log(0);
    }

    part2() {
        console.log(0);
    }
}



