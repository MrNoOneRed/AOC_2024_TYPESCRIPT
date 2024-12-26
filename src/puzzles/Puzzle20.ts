import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface ITile {
    pos: IPos,
    symbol: string,
    distance: number
}

const directions: IPos[] = [
    {x: 0, y: -1},
    {x: 1, y: 0},
    {x: 0, y: 1},
    {x: -1, y: 0}
];

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: ITile[][];
    declare startTile: ITile;
    declare endTile: ITile;
    declare best: number;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];
        this.best = 0;

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if (line) {
                this.map[y] = [];

                const xs = line.trim().split('');
                for (let x = 0; x < xs.length; x++) {
                    const pos: IPos = {x: x, y: y};
                    const symbol = xs[x];
                    const tile = {pos: pos, symbol: symbol, distance: -1};
                    this.map[y][x] = tile;

                    if (symbol === 'S') this.startTile = tile;
                    if (symbol === 'E') this.endTile = tile;
                }
            }
        });
    }

    part1() {
        const map = this.findPath([...this.map]);

        this.findShortcutsP1(map);

        console.log(this.best);
    }

    part2() {
        const map = this.findPath([...this.map]);

        this.findShortcutsP2(map);

        console.log(this.best);
    }

    findPath(map: ITile[][]): ITile[][] {
        this.startTile.distance = 0;

        let path = [this.startTile];

        while (true) {
            const newPath: ITile[] = [];

            for (const tile of path) {
                if(tile === this.endTile) return map;

                const distance = tile.distance + 1;

                for (const direction of directions) {
                    const nextPos = this.getSumPos(tile.pos, direction);

                    if (!this.isOutOfBounds(nextPos)) {
                        const nextTile: ITile = map[nextPos.y][nextPos.x];

                        if (nextTile.symbol !== '#' && nextTile.distance === -1) {
                            nextTile.distance = distance;

                            newPath.push(nextTile);
                        }
                    }
                }
            }

            path = newPath;

            if (path.length === 0) return map;
        }
    }

    findShortcutsP1(map: ITile[][]) {
        for(let y = 0; y < map.length; y++) {
            for(let x = 0; x < map[y].length; x++) {
                const tile = map[y][x];

                if(tile.symbol === '#' && !this.isOutOfBounds(tile.pos, 1)) {
                    this.findShortcutP1(map, tile);
                }
            }
        }
    }

    findShortcutP1(map: ITile[][], tile: ITile) {
        const sideTiles: ITile[] = [];

        for (const direction of directions) {
            const nextPos = this.getSumPos(tile.pos, direction);
            const nextTile = map[nextPos.y][nextPos.x];

            if(nextTile.distance !== -1) sideTiles.push(nextTile);
        }

        if(sideTiles.length >= 2) {
            sideTiles.sort((a, b) => {
                return a.distance - b.distance;
            });

            const firstCell = sideTiles.shift();
            const firstDistance = firstCell?.distance ?? 0;

            for (const sideTile of sideTiles) {

                const distance = sideTile.distance

                const check = distance - firstDistance - 2

                if (check >= 100) { this.best += 1 }
            }
        }
    }

    findShortcutsP2(map: ITile[][]) {
        for(let y = 0; y < map.length; y++) {
            for(let x = 0; x < map[y].length; x++) {
                const tile = map[y][x];

                if(tile.distance != -1) {
                    this.findShortcutP2(map, tile);
                }
            }
        }
    }

    findShortcutP2(map: ITile[][], tile: ITile) {
        for(let y = -20 ; y <= 20; y++) {
            const pos: IPos = {x: 0, y: tile.pos.y + y};

            if(pos.y < 0) continue;
            if(pos.y >= map.length) return;

            for(let x = -20 ; x <= 20; x++) {
                pos.x = tile.pos.x + x;

                if(pos.x < 0) continue;
                if(pos.x >= map[0].length) break;

                const distance = Math.abs(y) + Math.abs(x);

                if(distance === 0) continue;
                if(distance > 20) continue;

                const nextTile = map[pos.y][pos.x];

                if (nextTile.distance == -1) continue;

                const check = nextTile.distance - tile.distance - distance

                if (check < 100) continue

                this.best += 1
            }

        }
    }

    getSumPos(left: IPos, right: IPos): IPos {
        return {x: left.x + right.x, y: left.y + right.y}
    }

    isOutOfBounds(pos: IPos, margin: number = 0) {
        return pos.x < margin || pos.x >= this.map[0].length - margin || pos.y < margin || pos.y >= this.map.length - margin;
    }
}



