import * as fs from "node:fs";

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare patterns: string[];
    declare designs: string[];
    declare permutations: Record<string, boolean>;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.patterns = [];
        this.designs = [];
        this.permutations = {};

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                if(line.trim()) {
                    if(y === 0) {
                        this.patterns = line.trim().split(', ');
                    }
                    else this.designs.push(line.trim());
                }
            }
        });
    }

    part1() {
        let result = 0;

        for(const design of this.designs) {
            if(this.canBeCreated(design)) result++;
        }

        console.log(result);
    }

    part2() {
        let result = 0;

        for(const design of this.designs) {
            result += this.howManyOptions(design);
        }

        console.log(result);
    }

    canBeCreated(design: string) {
        let arr = Array(design.length + 1).fill(0);

        for (const pattern of this.patterns) {
            if (design.startsWith(pattern)) {
                arr[pattern.length] = 1;
            }
        }

        arr.forEach((v, i) => {
            if (v === 1) {
                for (const pattern of this.patterns) {
                    if (design.startsWith(pattern, i)) {
                        arr[pattern.length + i] = 1;
                    }
                }
            }
        });

        return arr.at(-1) !== 0;
    }

    howManyOptions(design: string) {
        let arr = Array(design.length + 1).fill(0);

        for (const pattern of this.patterns) {
            if (design.startsWith(pattern)) {
                arr[pattern.length]++;
            }
        }

        arr.forEach((v, i) => {
            if (v > 0) {
                for (const pattern of this.patterns) {
                    if (design.startsWith(pattern, i)) {
                        arr[pattern.length + i] += v;
                    }
                }
            }
        });

        return arr.at(-1);
    }
}



