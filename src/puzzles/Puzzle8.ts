import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface IAntenna {
    type: string,
    pos: IPos,
}

export default class Puzzle8 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare maxX: number;
    declare maxY: number;
    declare antennas: IAntenna[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.maxX = 0;
        this.maxY = 0;
        this.antennas = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if(line) {
                const items = line.trim().split('');

                if(!this.maxX) this.maxX = items.length;
                this.maxY++;

                for(let x = 0; x < items.length; x++) {
                    if(items[x] !== '.') this.antennas.push({type: items[x], pos: {x: x, y: y}});
                }
            }
        });
    }


    part1() {
        let result: string[] = [];

        for(const antenna1 of this.antennas) {
            const antennas2 = this.antennas.filter((antenna2) => antenna1.type === antenna2.type && (antenna1.pos.x !== antenna2.pos.x || antenna1.pos.y !== antenna2.pos.y));

            for(const antenna2 of antennas2) {
                const length: IPos = {x: antenna1.pos.x - antenna2.pos.x, y: antenna1.pos.y - antenna2.pos.y};
                const antinode: IPos = {x: antenna1.pos.x + length.x, y: antenna1.pos.y + length.y};

                if(this.isInBounds(antinode)) {
                    const antinodeId = this.getPosId(antinode);

                    if(!result.includes(antinodeId)) result.push(antinodeId);
                }
            }
        }

        console.log(result.length);
    }

    part2() {
        let result: string[] = [];

        for(const antenna1 of this.antennas) {
            const antennas2 = this.antennas.filter((antenna2) => antenna1.type === antenna2.type && (antenna1.pos.x !== antenna2.pos.x || antenna1.pos.y !== antenna2.pos.y));

            if(antennas2.length) {
                const antinodeId = this.getPosId(antenna1.pos);

                if(!result.includes(antinodeId)) result.push(antinodeId);
            }

            for(const antenna2 of antennas2) {
                const distance: IPos = {x: antenna1.pos.x - antenna2.pos.x, y: antenna1.pos.y - antenna2.pos.y};
                let antinode: IPos = {x: antenna1.pos.x + distance.x, y: antenna1.pos.y + distance.y};

                while(this.isInBounds(antinode)) {
                    const antinodeId = this.getPosId(antinode);

                    if(!result.includes(antinodeId)) result.push(antinodeId);

                    antinode.x += distance.x;
                    antinode.y += distance.y;
                }
            }
        }

        console.log(result.length);
    }

    isInBounds(pos: IPos): boolean {
        return pos.x >= 0 && pos.x < this.maxX && pos.y >= 0 && pos.y < this.maxY;
    }

    getPosId(pos: IPos) {
        return `${pos.x}-${pos.y}`;
    }
}

