import * as fs from "node:fs";

export default class Puzzle5 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare orders: string[];
    declare updates: number[][];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.orders = [];
        this.updates = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach(line =>  {
            if(line.search(/\|/) !== -1) {
                this.orders.push(line);
                // const order = line.split('|');
                // this.orders.push([parseInt(order[0]), parseInt(order[1])]);
            }

            if(line.search(/,/) !== -1) {
                const update = line.split(',').map((item) => parseInt(item));
                this.updates.push(update);
            }


        });
    }


    part1() {
        let result: number = 0;

        for(const update of this.updates) {
            if(this.isValidUpdate(update)) {
                const number = update[Math.floor(update.length / 2)];

                result += number;
            }
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;

        for(const update of this.updates) {
            if(!this.isValidUpdate(update)) {
                const fixed = this.getFixedUpdate(update);

                const number = fixed[Math.floor(fixed.length / 2)];

                result += number;
            }
        }

        console.log(result);
    }

    getFixedUpdate(update: number[]): number[] {
        let result: number[] = [...update];

        for(let l = 0; l < update.length - 1; l++) {
            for(let r = l + 1; r < update.length; r++) {
                const left = update[l];
                const right = update[r];

                if(left === right) continue;

                const search = `${right}|${left}`;

                if(this.orders.includes(search)) {
                    result[l] = right;
                    result[r] = left;

                    return this.getFixedUpdate(result);
                }
            }
        }

        return result;
    }

    isValidUpdate(update: number[]) {
        for(let l = 0; l < update.length - 1; l++) {
            for(let r = l + 1; r < update.length; r++) {
                const left = update[l];
                const right = update[r];

                if(left === right) continue;

                const search = `${right}|${left}`;

                if(this.orders.includes(search)) {
                    return false;
                }
            }
        }

        return true;
    }

}

