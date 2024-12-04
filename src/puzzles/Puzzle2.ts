import * as fs from "node:fs";

enum EDIR {
    up = 'up',
    down = 'down'
}

export default class Puzzle1 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare table: string[][];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;
        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        this.table = [];

        fileData.split(/\r?\n/).forEach(line =>  {
            const rows = line.trim().split(' ');

            this.table.push(rows);
        });
    }


    part1() {
        let result: number = 0;

        for(const row of this.table) {
            if(this.isRowValid(row)) result++;
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;

        for(const row of this.table) {
            if(this.isRowValid(row)) result++;
            else {
                for(let key = 0; key < row.length; key++) {
                    let newRow = [...row];

                    newRow.splice(key, 1);

                    if(this.isRowValid(newRow)) {
                        result++;
                        break;
                    }
                }
            }
        }

        console.log(result);
    }

    isRowValid(row: string[]) {
        let dir: EDIR | null = null;

        for(let key = 0; key < row.length -1; key++) {
            const left = parseInt(row[key], 10);
            const right = parseInt(row[key + 1], 10);
            const diff = left - right;
            const len = Math.abs(diff);

            if(len < 1 || len > 3) return false;
            else {
                if(!dir) dir = (diff < 0) ? EDIR.up : EDIR.down;

                if(diff < 0 && dir == EDIR.down) return false;
                if(diff > 0 && dir == EDIR.up) return false;
            }
        }

        return true;
    }
}

