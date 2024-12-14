import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface IGame {
    A: IPos,
    B: IPos,
    P: IPos
}

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare games: IGame[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.games = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const regButton = /X\+(-?\d+), Y\+(-?\d+)/;
        const regPrize = /X=(-?\d+), Y=(-?\d+)/;
        const lines: string[] = [];

        fileData.split(/\r?\n/).forEach((line) => {
            if(line) lines.push(line);
        });

        for (let i = 0; i < lines.length; i += 3) {
            const a = lines[i].trim().match(regButton);
            const b = lines[i + 1].trim().match(regButton);
            const p = lines[i + 2].trim().match(regPrize);

            this.games.push({
                A: {
                    x: a ? parseInt(a[1], 10) : 0,
                    y: a ? parseInt(a[2], 10) : 0
                },
                B: {
                    x: b ? parseInt(b[1], 10) : 0,
                    y: b ? parseInt(b[2], 10) : 0
                },
                P: {
                    x: p ? parseInt(p[1], 10) : 0,
                    y: p ? parseInt(p[2], 10) : 0
                }
            });
        }
    }

    part1() {
        let result = 0;

        for(const game of this.games) {
            const A = (game.P.x * game.B.y - game.P.y * game.B.x) / (game.B.y * game.A.x - game.B.x * game.A.y);
            const B = (game.P.y * game.A.x - game.P.x * game.A.y) / (game.B.y * game.A.x - game.B.x * game.A.y);

            if (Number.isInteger(A) && Number.isInteger(B) && A >= 0 && B >=0 && A <=100 && B <= 100) {
                result += A * 3 + B;
            }
        }

        console.log(result);
    }

    part2() {
        let result = 0;

        for(const game of this.games) {
            game.P.x += 10000000000000;
            game.P.y += 10000000000000;

            const A = (game.P.x * game.B.y - game.P.y * game.B.x) / (game.B.y * game.A.x - game.B.x * game.A.y);
            const B = (game.P.y * game.A.x - game.P.x * game.A.y) / (game.B.y * game.A.x - game.B.x * game.A.y);

            if (Number.isInteger(A) && Number.isInteger(B) && A >=0 && B >= 0) {
                result += A * 3 + B;
            }
        }

        console.log(result);
    }
}



