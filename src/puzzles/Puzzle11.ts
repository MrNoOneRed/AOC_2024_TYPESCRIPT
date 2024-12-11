import * as fs from "node:fs";

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare stones: number[];
    declare cache: {[id: string]: number}

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.cache = {};

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if(line) {
                this.stones = line.trim().split(' ').map((stone) => parseInt(stone));
            }
        });
    }


    part1() {
        console.log(this.countStones([...this.stones], 25));
    }

    part2() {
        console.log(this.countStones([...this.stones], 75));
    }

    countStones(stones: number[], blinks: number) {
        if(blinks === 0) return stones.length;

        let cnt = 0;

        for(const stone of stones) {
            const key = `${blinks}-${stone}`;
            const cachedStone = this.cache[key];

            if(cachedStone) {
                cnt += cachedStone;
                continue;
            }

            let newStone: number[] = [];
            if(stone === 0) newStone = [1];
            else {
                const even = stone.toString().length % 2 === 0;

                if(even) {
                    const stoneString = stone.toString();
                    const left = parseInt(stoneString.slice(0, stoneString.length / 2));
                    const right = parseInt(stoneString.slice(stoneString.length / 2, stoneString.length));

                    newStone = [left, right];
                }
                else newStone = [stone * 2024];
            }

            const newStoneCount = this.countStones(newStone, blinks - 1);

            this.cache[key] = newStoneCount;

            cnt += newStoneCount;
        }

        return cnt;
    }
}



