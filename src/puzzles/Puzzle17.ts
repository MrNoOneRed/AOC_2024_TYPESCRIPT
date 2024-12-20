import * as fs from "node:fs";

interface IInput {
    A: bigint,
    B: bigint,
    C: bigint,
    P: number[]
}

export default class Puzzle11 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare input: IInput;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.input = {A: 0n, B: 0n, C: 0n, P: []};

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');
        const lines = fileData.split(/\r?\n/);

        const a = lines[0].trim().match(/(-?\d+)/);
        const b = lines[1].trim().match(/(-?\d+)/);
        const c = lines[2].trim().match(/(-?\d+)/);
        const p = lines[4].trim().match(/(-?\d+)/g);

        this.input.A = a ? BigInt(a[0]) : 0n;
        this.input.B = b ? BigInt(b[0]) : 0n;
        this.input.C = c ? BigInt(c[0]) : 0n;
        this.input.P = p ? p.map((num) => parseInt(num)) : [];
    }

    part1() {
        const input = {...this.input};

        console.log(this.programRun(input).join(','));
    }

    part2() {
        console.log(Number(this.calculateA(this.input.P)));
    }

    calculateA(program: number[], a: bigint = 0n, b: bigint = 0n, c: bigint = 0n, ip = -1) {
        if(Math.abs(ip) > program.length) return a;

        const ipb = program.length + ip;
        for(let i = 0; i < 8; i++) {

            let na: bigint = a * 8n + BigInt(i);

            const input: IInput = {A: na, B: b, C: c, P: program};
            const [result, nInput] = this.programRun(input);
            if(result[0] === BigInt(program[ipb])) {
                na = this.calculateA(program, na, nInput.B, nInput.C, ip - 1);

                if(na) {
                    return na;
                }
            }
        }

        return 0n;
    }

    programRun(input: IInput): [bigint[], IInput] {
        let i = 0;
        let result: bigint[] = [];

        while(true) {
            const opcode = input.P[i];
            const operand = BigInt(input.P[i + 1]);
            const number = operand === 4n ? input.A : operand === 5n ? input.B : operand === 6n ? input.C : operand;

            switch(opcode) {
                case 0:
                    input.A = input.A / (2n ** number);
                    break;
                case 1:
                    input.B = input.B ^ operand;
                    break;
                case 2:
                    input.B = number % 8n;
                    break;
                case 3:
                    if(input.A !== 0n) i = Number(operand) - 2;
                    break;
                case 4:
                    input.B = input.B ^ input.C;
                    break;
                case 5:
                    result.push(number % 8n);
                    break;
                case 6:
                    input.B = input.A / (2n ** number);
                    break;
                case 7:
                    input.C = input.A / (2n ** number);
                    break;
            }

            i += 2;
            if(i >= input.P.length) break;
        }

        return [result, input];
    }
}



