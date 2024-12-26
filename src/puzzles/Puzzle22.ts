import * as fs from "node:fs";

const secret: number = 16777216;

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare numbers: number[]

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.numbers = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                this.numbers.push(parseInt(line.trim()));
            }
        });
    }

    part1() {
        const solution = this.getSolution([...this.numbers]);

        console.log(solution);
    }

    part2() {
        const solution = this.getSolution([...this.numbers], 2);

        console.log(solution);
    }

    getSolution(numbers: number[], part: number = 1) {
        const sequences: Map<string, number> = new Map();
        let secret = 0;
        let price = 0;
        let lastPrice = 0;
        let delta = 0;
        let key = '';
        let minus1 = 0;
        let minus2 = 0;
        let minus3 = 0;
        let result = 0;

        for (let number of numbers) {
            const firstSequences: Set<string> = new Set();
            delta = 0, minus1 = 0, minus2 = 0, minus3 = 0;
            secret = number;
            for (let i = 0; i < 2000; i++) {
                secret = this.mod((secret * 64) ^ secret, 16777216);
                secret = this.mod(Math.floor(secret / 32) ^ secret, 16777216);
                secret = this.mod((secret * 2048) ^ secret, 16777216);
                if (part === 2) {
                    price = secret % 10;
                    if (i > 0) {
                        minus3 = minus2;
                        minus2 = minus1;
                        minus1 = delta;
                        delta = price - lastPrice;
                        if (i > 3) {
                            key = [minus3, minus2, minus1, delta].join(',');
                            if (!firstSequences.has(key)) {
                                firstSequences.add(key);
                                sequences.set(key, (sequences.get(key) ?? 0) + price);
                            }
                        }
                    }
                    lastPrice = price;
                }
            }
            result += secret;
        }
        if (part === 2) result = Math.max(...[...sequences.values()]);

        return result;
    }

    mod(n: number, d: number) {
        return ((n % d) + d) % d;
    }
}



