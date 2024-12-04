import * as fs from "node:fs";

export default class Puzzle1 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare input: string;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;
        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        this.input = fs.readFileSync(filePath, 'utf-8');
    }


    part1() {
        let result: number = 0;
        let mul_match: string[];
        let numbers_match: string[];
        const reg_mul = /(mul\(\d{0,3},\d{0,3}\))/g;

        while((mul_match = reg_mul.exec(this.input.trim())) !== null) {
            const mul = mul_match[0].trim();
            const reg_numbers = /\d+,\d+/g;

            numbers_match = reg_numbers.exec(mul);

            const numbers: string[] = numbers_match[0].split(',');

            result += parseInt(numbers[0]) * parseInt(numbers[1]);
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;
        let match1: string[];
        let match2: string[];
        let enabled = true;
        const reg_main = /(mul\(\d{0,3},\d{0,3}\))|(do\(\))|(don't\(\))/g;

        while((match1 = reg_main.exec(this.input.trim())) !== null) {
            const entry = match1[0].trim();
            const starts = entry.substring(0, 3);

            switch (starts) {
                case 'don':
                    enabled = false;
                    break;
                case 'do(':
                    enabled = true;
                    break;
                case 'mul':

                    if(enabled) {
                        const reg_numbers = /\d+,\d+/g;

                        match2 = reg_numbers.exec(entry);

                        const numbers: string[] = match2[0].split(',');

                        result += parseInt(numbers[0]) * parseInt(numbers[1]);
                    }
                    break;
            }

        }
        console.log(result);
    }

}

