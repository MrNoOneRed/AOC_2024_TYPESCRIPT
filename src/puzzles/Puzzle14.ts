import * as fs from "node:fs";

interface IPos {
    x: number,
    y: number
}

interface IRobot {
    pos: IPos,
    vel: IPos
}

interface IQuadrant {
    start: IPos,
    end: IPos,
    count: number
}

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare robots: IRobot[];
    declare maxX: number;
    declare maxY: number;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.robots = [];

        if (example) {
            this.maxX = 11;
            this.maxY = 7;
        } else {
            this.maxX = 101;
            this.maxY = 103;
        }

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const regLine = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

        fileData.split(/\r?\n/).forEach((line) => {
            if (line) {
                const data = line.trim().match(regLine);

                if (data) {
                    this.robots.push({
                        pos: {x: parseInt(data[1]), y: parseInt(data[2])},
                        vel: {x: parseInt(data[3]), y: parseInt(data[4])}
                    });
                }
            }
        });
    }

    part1() {
        this.moveRobots(100);

        console.log(this.getSafetyFactor());
    }

    part2() {
        this.moveRobots(6668);
        this.draw();
    }

    moveRobots(seconds: number) {
        for(let s = 0; s < seconds; s++) {
            for (const robot of this.robots) {
                robot.pos.x += robot.vel.x;
                robot.pos.y += robot.vel.y;

                if (robot.pos.x < 0) robot.pos.x = this.maxX + robot.pos.x;
                if (robot.pos.x >= this.maxX) robot.pos.x = robot.pos.x - this.maxX;
                if (robot.pos.y < 0) robot.pos.y = this.maxY + robot.pos.y ;
                if (robot.pos.y >= this.maxY) robot.pos.y = robot.pos.y - this.maxY;
            }
        }
    }

    getSafetyFactor() {
        let factor = 1;
        const halfX = Math.floor(this.maxX / 2);
        const halfY = Math.floor(this.maxY / 2);
        const quadrants: IQuadrant[] = [
            {start: {x: 0, y: 0}, end: {x: halfX - 1, y: halfY - 1}, count: 0},
            {start: {x: halfX + 1, y: 0}, end: {x: this.maxX - 1, y: halfY - 1}, count: 0},
            {start: {x: 0, y: halfY + 1}, end: {x: halfX - 1, y: this.maxY - 1}, count: 0},
            {start: {x: halfX + 1, y: halfY + 1}, end: {x: this.maxX - 1, y: this.maxY - 1}, count: 0},
        ];

        for(const robot of this.robots) {
            for(const quadrant of quadrants) {
                if(robot.pos.x >= quadrant.start.x && robot.pos.x <= quadrant.end.x && robot.pos.y >= quadrant.start.y && robot.pos.y <= quadrant.end.y) quadrant.count++;
            }
        }


        for(const quadrant of quadrants) {
            factor *= quadrant.count;
        }

        return factor;
    }

    draw() {
        const map: string[][] = [];

        for (let y = 0; y < this.maxY; y++) {
            map[y] = [];

            for (let x = 0; x < this.maxX; x++) {
                map[y][x] = '.';
            }
        }

        for(const robot of this.robots) {
            let symbol = map[robot.pos.y][robot.pos.x];

            if(symbol === '.') map[robot.pos.y][robot.pos.x] = '1';
            else map[robot.pos.y][robot.pos.x] = `${parseInt(symbol) + 1}`;
        }

        for (let y = 0; y < this.maxY; y++) {
            console.log(map[y].join(''));
        }

        console.log("\n");
    }
}



