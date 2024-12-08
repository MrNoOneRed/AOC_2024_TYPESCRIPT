import * as fs from "node:fs";

interface IData {
    solution: number,
    numbers: number[]
}

export default class Puzzle6 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare data: IData[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.data = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if(line.trim()) {
                let tmp = line.trim().split(':');
                this.data.push({
                    solution: parseInt(tmp[0]),
                    numbers: tmp[1].trim().split(' ').map((item) => parseInt(item))
                });
            }
        });
    }


    part1() {
        let result: number = 0;

        for(const data of this.data) {
            const permutations = this.getAllPermutations(data.numbers, ['+', '*']);

            for(const permutation of permutations) {
                if(this.test(data, permutation)) {
                    result += data.solution;
                    break;
                }
            }
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;

        for(const data of this.data) {
            const permutations = this.getAllPermutations(data.numbers, ['+', '*', '||']);

            for(const permutation of permutations) {
                if(this.test(data, permutation)) {
                    result += data.solution;
                    break;
                }
            }
        }

        console.log(result);
    }

    getAllPermutations(numbers: number[], types: string[]) {
        const results: string[][] = [];
        const nLength = numbers.length - 1;
        const tLength = types.length;

        for(let n = 0; n < Math.pow(tLength, nLength); n++) {
            let index = n;
            let result: string[] = [];
            let count = 1;

            for (let i = 0; i < nLength; i++) {
                result.push(types[index % tLength]);

                index = Math.floor(index / tLength);
                count++;
            }

            results.push(result);
        }

        return results;
    }

    test(data: IData, permutation: string[]) {
        let sum: number = data.numbers[0];

        for(let p = 0; p < permutation.length; p++) {
            if(permutation[p] === '||') sum = parseInt(`${sum}${data.numbers[p + 1]}`);
            else sum = eval(`${sum.toString()}${permutation[p]}${data.numbers[p + 1]}`);
        }

        return sum === data.solution;
    }
}

