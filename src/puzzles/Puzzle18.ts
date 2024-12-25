import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface ITile {
    pos: IPos,
    block: boolean,
    distance: number
}

const directions: Record<string, IPos> = {
    n: {x: 0, y: -1},
    e: {x: 1, y: 0},
    s: {x: 0, y: 1},
    w: {x: -1, y: 0}
};

const maxDistance = 99999999;

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: ITile[][];
    declare bytes: IPos[];
    declare size: IPos;
    declare fill: number;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];
        this.bytes = [];

        if(this.example) {
            this.size = {x: 6, y: 6};
            this.fill = 12;
        }
        else {
            this.size = {x: 70, y: 70};
            this.fill = 1024;
        }

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                const [x, y] = line.trim().split(',').map((item) => parseInt(item));
                this.bytes.push({x: x, y: y});
            }
        });
    }

    part1() {
        this.fillMemory();

        // Fill with bytes
        let map = [...this.map];
        for(let i = 0; i < this.fill; i++) {
            const byte = this.bytes[i];
            map[byte.y][byte.x].block = true;
        }

        map = this.findPath(map);

        console.log(map[this.size.y][this.size.x].distance);
    }

    part2() {
        this.fillMemory();

        // Fill with bytes
        const map = [...this.map];
        for(let i = 0; i < this.bytes.length; i++) {
            const byte = this.bytes[i];
            map[byte.y][byte.x].block = true;

            const newMap = this.findPath([...this.resetMapDistance(map)]);
            const distance = newMap[this.size.y][this.size.x].distance;

            if(distance === maxDistance) {
                console.log(`${this.bytes[i].x},${this.bytes[i].y}`);
                break;
            }

        }
    }

    fillMemory() {
        for(let y = 0; y <= this.size.y; y++) {
            this.map[y] = [];

            for(let x = 0; x <= this.size.x; x++) {
                this.map[y][x] = {pos: {x: x, y: y}, block: false, distance: maxDistance};
            }
        }
    }

    findPath(map: ITile[][]): ITile[][] {
        const tile: ITile = map[0][0];

        tile.distance = 0;

        let path = [tile];

        while(true) {
            const newPath: ITile[] = [];

            for (const tile of path) {
                const distance = tile.distance + 1;

                for(const nesw in directions) {
                    const direction = directions[nesw];
                    const nextPos = this.getSumPos(tile.pos, direction);

                    if(!this.isOutOfBounds(nextPos)) {
                        const nextTile: ITile = map[nextPos.y][nextPos.x];

                        if(!nextTile.block && nextTile.distance > distance) {
                            nextTile.distance = distance;

                            newPath.push(nextTile);
                        }
                    }
                }
            }

            path = newPath;

            if(path.length === 0) return map;
        }
    }

    resetMapDistance(map: ITile[][]): ITile[][] {
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                map[y][x].distance = maxDistance;
            }
        }

        return map;
    }

    getSumPos(left: IPos, right: IPos): IPos {
        return {x: left.x + right.x, y: left.y + right.y}
    }

    isOutOfBounds(pos: IPos) {
        return pos.x < 0 || pos.x >= this.map[0].length || pos.y < 0 || pos.y >= this.map.length;
    }
}



