import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

const directions = {
    '<': {x: -1, y: 0},
    '>': {x: 1, y: 0},
    '^': {x: 0, y: -1},
    'v': {x: 0, y: 1}
};

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: string[][];
    declare moves: IPos[];
    declare robot: IPos;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];
        this.moves = [];
        this.robot = {x: 0, y: 0};

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const regLine = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                const inputLine = line.trim();
                if (inputLine.startsWith('#')) {
                    const xs = inputLine.split('');
                    this.map[y] = [];

                    for (let x = 0; x < xs.length; x++) {
                        const symbol = xs[x];
                        this.map[y].push(symbol);

                        if (symbol === '@') {
                            this.robot.y = y;
                            this.robot.x = x;
                        }
                    }
                } else if (['<', '>', '^', 'v'].includes(inputLine.substring(0, 1))) {
                    this.moves.push(...inputLine.split('').map((arrow) => directions[arrow as '<' | '>' | '^' | 'v']));
                }
            }
        });
    }

    part1() {
        for (let move of this.moves) {
            const nextPos = this.getSumPos(this.robot, move);

            if (!this.isOutOfBounds(nextPos)) {
                const symbol = this.getSymbol(nextPos);

                if (symbol === '#') continue;
                else if (symbol === '.') {
                    this.map[this.robot.y][this.robot.x] = '.';
                    this.map[nextPos.y][nextPos.x] = '@';
                    this.robot = nextPos;
                } else if (symbol === 'O') {
                    const isMoved = this.moveBox(nextPos, move);

                    if (isMoved) {
                        this.map[this.robot.y][this.robot.x] = '.';
                        this.map[nextPos.y][nextPos.x] = '@';
                        this.robot = nextPos;
                    }
                }
            }
        }

        this.draw();

        console.log(this.getGpsCoordinates());
    }

    part2() {
        this.expandMap();

        for (let move of this.moves) {
            const nextPos = this.getSumPos(this.robot, move);

            if (!this.isOutOfBounds(nextPos)) {
                const symbol = this.getSymbol(nextPos);
                // console.log(nextPos);
                if (symbol === '#') continue;
                else if (symbol === '.') {
                    this.map[this.robot.y][this.robot.x] = '.';
                    this.map[nextPos.y][nextPos.x] = '@';
                    this.robot = nextPos;
                } else if (symbol === '[') {
                    let nextPos2: IPos = {x: nextPos.x + 1, y: nextPos.y};

                    const isMoved = this.moveBigBox(nextPos, nextPos2, move);

                    if (isMoved) {
                        this.map[this.robot.y][this.robot.x] = '.';
                        this.map[nextPos.y][nextPos.x] = '@';
                        this.robot = nextPos;
                    }
                } else if (symbol === ']') {
                    let nextPos2: IPos = {x: nextPos.x - 1, y: nextPos.y};

                    const isMoved = this.moveBigBox(nextPos2, nextPos, move);

                    if (isMoved) {
                        this.map[this.robot.y][this.robot.x] = '.';
                        this.map[nextPos.y][nextPos.x] = '@';
                        this.robot = nextPos;
                    }
                }
            }
        }

        this.draw();

        console.log(this.getGpsCoordinates());
    }

    draw() {
        for (let y = 0; y < this.map.length; y++) {
            console.log(this.map[y].join(''));
        }
    }

    getSumPos(left: IPos, right: IPos): IPos {
        return {x: left.x + right.x, y: left.y + right.y}
    }

    getSymbol(pos: IPos) {
        return this.map[pos.y][pos.x];
    }

    isOutOfBounds(pos: IPos) {
        return pos.x < 0 || pos.x >= this.map[0].length || pos.y < 0 || pos.y >= this.map.length;
    }

    moveBigBox(leftSide: IPos, rightSide: IPos, move: IPos) {
        // Vertical move
        if (move.x === 0) {
            const nextLeftPos = this.getSumPos(leftSide, move);
            const nextLeftSymbol = this.getSymbol(nextLeftPos);
            const nextRightPos = this.getSumPos(rightSide, move);
            const nextRightSymbol = this.getSymbol(nextRightPos);

            if (nextLeftSymbol === '#' || nextRightSymbol === '#') return false;
            else if(nextLeftSymbol === '.' && nextRightSymbol === '.') {
                this.map[nextLeftPos.y][nextLeftPos.x] = '[';
                this.map[nextRightPos.y][nextRightPos.x] = ']';
                this.map[leftSide.y][leftSide.x] = '.';
                this.map[rightSide.y][rightSide.x] = '.';
                return true;
            }
            else {
                let isMoved: boolean | undefined = false;

                if(nextLeftSymbol === '[' && nextRightSymbol === ']') {
                    isMoved = this.moveBigBox(nextLeftPos, nextRightPos, move);
                }

                if(nextLeftSymbol === '.' && nextRightSymbol === '[') {
                    let nextPos2: IPos = {x: nextRightPos.x + 1, y: nextRightPos.y};
                    isMoved = this.moveBigBox(nextRightPos, nextPos2, move);
                }

                if(nextLeftSymbol === ']' && nextRightSymbol === '.') {
                    let nextPos2: IPos = {x: nextLeftPos.x - 1, y: nextLeftPos.y};
                    isMoved = this.moveBigBox(nextPos2, nextLeftPos, move);
                }

                if(nextLeftSymbol === ']' && nextRightSymbol === '[') {
                    const leftSideL = {x: nextLeftPos.x - 1, y: nextLeftPos.y};
                    const leftSideR = nextLeftPos;

                    const rightSideL = nextRightPos;
                    const rightSideR = {x: nextRightPos.x + 1, y: nextRightPos.y};

                    if(this.isMovable(leftSideL, leftSideR, move) && this.isMovable(rightSideL, rightSideR, move)){
                        this.moveBigBox(leftSideL, leftSideR, move);
                        this.moveBigBox(rightSideL, rightSideR, move);

                        isMoved = true;
                    }
                }

                if (isMoved) {
                    this.map[nextLeftPos.y][nextLeftPos.x] = '[';
                    this.map[nextRightPos.y][nextRightPos.x] = ']';
                    this.map[leftSide.y][leftSide.x] = '.';
                    this.map[rightSide.y][rightSide.x] = '.';
                    return true;
                } else return false;
            }
        }

        //Horizontal move
        if (move.y === 0) {
            const nextPos = this.getSumPos(move.x < 0 ? leftSide : rightSide, move);
            const nextSymbol = this.getSymbol(nextPos);

            if (nextSymbol === '#') return false;
            else if (nextSymbol === '.') {
                this.map[nextPos.y][nextPos.x] = move.x < 0 ? '[' : ']';
                this.map[leftSide.y][leftSide.x] = move.x < 0 ? ']' : '.';
                this.map[rightSide.y][rightSide.x] = move.x < 0 ? '.' : '[';
                return true;
            } else if (nextSymbol === ']' || nextSymbol === '[') {
                let isMoved: boolean | undefined = false;

                if (nextSymbol === ']') {
                    let nextPos2: IPos = {x: nextPos.x - 1, y: nextPos.y};
                    isMoved = this.moveBigBox(nextPos2, nextPos, move);
                } else if (nextSymbol === '[') {
                    let nextPos2: IPos = {x: nextPos.x + 1, y: nextPos.y};
                    isMoved = this.moveBigBox(nextPos, nextPos2, move);
                }

                if (isMoved) {
                    this.map[nextPos.y][nextPos.x] = move.x < 0 ? '[' : ']';
                    this.map[leftSide.y][leftSide.x] = move.x < 0 ? ']' : '.';
                    this.map[rightSide.y][rightSide.x] = move.x < 0 ? '.' : '[';
                    return true;
                } else return false;
            }


        }
    }

    isMovable(leftSide: IPos, rightSide: IPos, move: IPos): boolean {
        const nextLeftPos = this.getSumPos(leftSide, move);
        const nextLeftSymbol = this.getSymbol(nextLeftPos);
        const nextRightPos = this.getSumPos(rightSide, move);
        const nextRightSymbol = this.getSymbol(nextRightPos);

        if (nextLeftSymbol === '#' || nextRightSymbol === '#') return false;
        else if(nextLeftSymbol === '.' && nextRightSymbol === '.') return true;
        else {
            if(nextLeftSymbol === '[' && nextRightSymbol === ']') {
                return this.isMovable(nextLeftPos, nextRightPos, move);
            }

            if(nextLeftSymbol === '.' && nextRightSymbol === '[') {
                let nextPos2: IPos = {x: nextRightPos.x + 1, y: nextRightPos.y};
                return this.isMovable(nextRightPos, nextPos2, move);
            }

            if(nextLeftSymbol === ']' && nextRightSymbol === '.') {
                let nextPos2: IPos = {x: nextLeftPos.x - 1, y: nextLeftPos.y};
                return this.isMovable(nextPos2, nextLeftPos, move);
            }

            if(nextLeftSymbol === ']' && nextRightSymbol === '[') {
                let nextPos2Left: IPos = {x: nextLeftPos.x - 1, y: nextLeftPos.y};
                const isMovableLeft = this.isMovable(nextPos2Left, nextLeftPos, move);

                let nextPos2Right: IPos = {x: nextRightPos.x + 1, y: nextRightPos.y};
                const isMovableRight = this.isMovable(nextRightPos, nextPos2Right, move);

                return isMovableLeft && isMovableRight;
            }
        }
        return false;
    }

    moveBox(boxPos: IPos, move: IPos) {
        const nextPos = this.getSumPos(boxPos, move);
        const symbol = this.getSymbol(nextPos);

        if (symbol === '.') {
            this.map[boxPos.y][boxPos.x] = '.';
            this.map[nextPos.y][nextPos.x] = 'O';
            return true;
        } else if (symbol === '#') return false;
        else if (symbol === 'O') {
            const isMoved = this.moveBox(nextPos, move);

            if (isMoved) {
                this.map[boxPos.y][boxPos.x] = '.';
                this.map[nextPos.y][nextPos.x] = 'O';
                return true;
            } else return false;
        }

        return false;
    }



    getGpsCoordinates() {
        let coordinates = 0;

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[0].length; x++) {
                if (this.map[y][x] === 'O' || this.map[y][x] === '[') {
                    coordinates += 100 * y + x;
                }
            }
        }

        return coordinates;
    }

    expandMap() {
        const newMap: string[][] = [];
        for (let y = 0; y < this.map.length; y++) {
            newMap[y] = [];

            for (let x = 0; x < this.map[y].length; x++) {
                const symbol = this.map[y][x];

                if (symbol === '#') newMap[y].push(...['#', '#']);
                if (symbol === '.') newMap[y].push(...['.', '.']);
                if (symbol === 'O') newMap[y].push(...['[', ']']);
                if (symbol === '@') {
                    newMap[y].push(...['@', '.']);
                    this.robot.x = newMap[y].indexOf('@');
                }
            }
        }

        this.map = newMap;
    }
}



