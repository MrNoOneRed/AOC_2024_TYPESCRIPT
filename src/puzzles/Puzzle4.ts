import * as fs from "node:fs";

const directions = [
    [-1, -1], [0, -1], [1, -1],
    [-1, 0], [1, 0],
    [-1, 1], [0, 1], [1, 1]
];

const xDirections = [
    {start: [-1, -1], direction: [1, 1]},
    {start: [1, -1], direction: [-1, 1]}
];

const word = 'XMAS';
const xWord = 'MAS';

export default class Puzzle1 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: string[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;
        this.map = [];
        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach(line =>  {
            this.map.push(line.trim());
        });
    }


    part1() {
        let result: number = 0;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++){
                result += this.countWords(x, y);
            }
        }

        console.log(result);
    }

    part2() {
        let result: number = 0;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++){
                result += this.countXWords(x, y);
            }
        }

        console.log(result);
    }

    countWords(x: number, y: number) {
        let results = 0;

        for(const dir of directions) {
            const maxX = x + (dir[0] * 3);
            const maxY = y + (dir[1] * 3);

            if(maxX < 0 || maxX >= this.map[y].length) continue;
            if(maxY < 0 || maxY >= this.map.length) continue;

            let count = true;
            for(let i = 0; i < word.length; i++) {
                const letter = word.substring(i, i + 1);
                const nextX = x + (i * dir[0]);
                const nextY = y + (i * dir[1]);
                const nextLetter = this.map[nextY].substring(nextX, nextX+1);

                if(letter !== nextLetter) {
                    count = false;
                    break;
                }
            }

            if(count) results++;
        }

        return results;
    }

    countXWords(x: number, y: number){
        const current = this.map[y].substring(x, x + 1);

        if(current === 'A') {
            let count = true;

            for(const dir of xDirections) {
                const startX = x + dir.start[0];
                const startY = y + dir.start[1];

                if(startY < 0 || startY >= this.map.length) return 0;
                if(startX < 0 || startX >= this.map[startY].length) return 0;

                const startL = this.map[startY].substring(startX, startX + 1);
                const flow = startL === 'M' ? true : startL === 'S' ? false : null;

                if(flow === null) return 0;

                for(let i = 0; i < xWord.length; i++) {
                    const letter = flow ? xWord.substring(i, i + 1) : xWord.substring(xWord.length - i, xWord.length - i - 1);
                    const nextX = startX + (i * dir.direction[0]);
                    const nextY = startY + (i * dir.direction[1]);

                    if(nextY < 0 || nextY >= this.map.length) return 0;
                    if(nextX < 0 || nextX >= this.map[nextY].length) return 0;

                    const nextLetter = this.map[nextY].substring(nextX, nextX+1);

                    if(letter !== nextLetter) return 0;
                }

                if(!count) return 0;
            }

            return 1;
        }

        return 0;
    }
}

