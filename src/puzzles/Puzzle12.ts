import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface IPlot {
    pos: IPos,
    fence: IFence
}

interface IFence {
    top: boolean,
    right: boolean,
    bottom: boolean,
    left: boolean
}

interface IArea {
    type: string,
    plotSize: number,
    fenceSize: number,
    plots: IPlot[],
}

const directions: {[key: string]: IPos} = {
    top: {x: 0, y: -1},
    right: {x: 1, y: 0},
    bottom: {x: 0, y: 1},
    left: {x: -1, y: 0}
}

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare map: string[][];
    declare maxY: number;
    declare maxX: number;
    declare checked: string[];

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.map = [];
        this.checked = [];

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if(line) {
                this.map.push(line.trim().split(''));
            }
        });

        this.maxY = this.map.length;
        this.maxX = this.map[0].length;
    }


    part1() {
        let result = 0;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                const pos: IPos = {x: x, y: y};

                if(!this.isChecked(pos)) {
                    const area = this.getArea(pos);

                    if(area) {
                        result += area.plotSize * area.fenceSize;
                    }
                }
            }
        }

        console.log(result);
    }

    part2() {
        let result = 0;

        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                const pos: IPos = {x: x, y: y};

                if(!this.isChecked(pos)) {
                    const area = this.getArea(pos);

                    if(area) {
                        result += area.plotSize * this.getAreaSidesCount(area);
                    }
                }
            }
        }

        console.log(result);
    }

    getArea(pos: IPos, area: IArea | null = null): IArea | null {
        if(this.isChecked(pos)) return area;

        this.check(pos);

        const type = this.getType(pos);
        const fence: IFence = {top: false, right: false, bottom: false, left: false};
        const nextPosCheck: IPos[] = [];
        let fenceSize = 0;

        for(const direction in directions) {
            const dirPos: IPos = directions[direction];
            const newPos: IPos = {x: pos.x + dirPos.x, y: pos.y + dirPos.y};

            fence[direction as keyof IFence] = this.isOutOfBounds(newPos) ? true : (!this.isOutOfBounds(newPos) && this.getType(newPos) !== type);

            if(fence[direction as keyof IFence]) fenceSize++;
            if(!this.isOutOfBounds(newPos) && this.getType(newPos) === type && !this.isChecked(newPos)) nextPosCheck.push(newPos);
        }

        const plot: IPlot = {
            pos: pos,
            fence: fence
        }

        if(!area) {
            area = {
                type: type,
                plotSize: 1,
                fenceSize: fenceSize,
                plots: [plot]
            }
        }
        else {
            area.plotSize++;
            area.fenceSize += fenceSize;
            area.plots.push(plot);
        }

        for(const nextPos of nextPosCheck) {
            area = this.getArea(nextPos, area);
        }

        return area;
    }

    getAreaSidesCount(area: IArea) {
        let size = 0;

        const plots: {[key: string]: {top: number[], right: number[], bottom: number[], left: number[]}} = {};

        area.plots.sort((a, b) => {
            return a.pos.y - b.pos.y;
        });

        for(const plot of area.plots) {
            const id = `V${plot.pos.x}`;

            if(!plots[id]) plots[id] = {top: [], right: [], bottom: [], left: []};

            if(plot.fence.left) plots[id].left.push(plot.pos.y);
            if(plot.fence.right) plots[id].right.push(plot.pos.y);
        }

        area.plots.sort((a, b) => {
            return a.pos.x - b.pos.x;
        });

        for(const plot of area.plots) {
            const id = `H${plot.pos.y}`;

            if(!plots[id]) plots[id] = {top: [], right: [], bottom: [], left: []};

            if(plot.fence.top) plots[id].top.push(plot.pos.x);
            if(plot.fence.bottom) plots[id].bottom.push(plot.pos.x);
        }

        const sides: number[][] = [];
        for(const id in plots) {
            if(plots[id].top.length) sides.push(plots[id].top);
            if(plots[id].right.length) sides.push(plots[id].right);
            if(plots[id].bottom.length) sides.push(plots[id].bottom);
            if(plots[id].left.length) sides.push(plots[id].left);
        }

        for(const side of sides) {
            let current = side[0];
            let max = side[side.length - 1];

            let connected = false;
            let prev = -1;
            while(current <= max) {
                if(side.includes(current)) {
                    if(prev === -1 || prev + 1 < current) {
                        size++;
                    }

                    prev = current;
                }

                current++;
            }
        }

        return size;
    }

    isOutOfBounds(pos: IPos) {
        return  pos.x < 0 || pos.x >= this.maxX || pos.y < 0 || pos.y >= this.maxY;
    }

    getId(pos: IPos) {
        return `${this.map[pos.y][pos.x]}:${pos.x}:${pos.y}`;
    }

    isChecked(pos: IPos) {
        const id = this.getId(pos);

        return this.checked.includes(id);
    }

    check(pos: IPos) {
        const id = this.getId(pos);

        this.checked.push(id);
    }

    getType(pos: IPos) {
        return this.map[pos.y][pos.x];
    }
}



