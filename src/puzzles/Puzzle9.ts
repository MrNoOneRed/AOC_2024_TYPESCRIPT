import * as fs from "node:fs";

export default class Puzzle9 implements PuzzleInterface {
    declare day: number;
    declare example: boolean;

    declare disk: string;

    constructor(day: number, example: boolean) {
        this.day = day;
        this.example = example;

        this.parseInput();
    }

    parseInput() {
        const filePath = `./input/puzzle_${this.day}${this.example ? 'e' : ''}.txt`;
        const fileData = fs.readFileSync(filePath, 'utf-8');

        fileData.split(/\r?\n/).forEach((line, y) => {
            if(line) {
                this.disk = line.trim();
            }
        });
    }


    part1() {
        const disk = this.disk.split('').map(n => parseInt(n));
        const fragmented = this.decodeDisk(disk);
        const defragmented = this.defragmentByBlock(fragmented);
        const result = this.countData(defragmented);

        console.log(result);
    }

    part2() {
        const disk = this.disk.split('').map(n => parseInt(n));
        const fragmented = this.decodeDisk(disk);
        const defragmented = this.defragmentByFile(fragmented);
        const result = this.countData(defragmented);

        console.log(result);
    }

    decodeDisk(disk: number[], type: 'block' | 'file' = 'block') {
        let result: string[] = [];

        for(let i = 0; i < disk.length; i++) {
            let char = '.';
            if(i % 2 === 0) char = Math.floor(i / 2).toString();

            const number = disk[i];
            const entry: string[] = [];
            for(let c = 0; c < number; c++) {
                if(type === 'block') entry.push(char);
                if(type === 'file') {
                    if(!entry.length) entry.push(char);
                    else entry[0] += char;
                }
            }

            result.push(...entry);
        }

        return result;
    }

    defragmentByBlock(disk: string[]) {
        let i = 0;

        while(disk.includes('.')) {
            let number: string | undefined = disk[i];

            if(number && number === '.') {
                number = disk.pop();

                while(number === '.') {
                    number = disk.pop();
                }

                if(number) disk[i] = number;
            }
            i++;
        }

        return disk;
    }

    defragmentByFile(disk: string[]) {
        let e = disk.length - 1;

        while(e >= 0) {
            const block = disk[e];

            if(block !== '.') {
                const fileSize = this.getSize(disk, e, true);

                for(let s = 0; s < e; s++) {
                    const space = disk[s];

                    if(space === '.') {
                        const spaceSize = this.getSize(disk, s);

                        if(spaceSize >= fileSize) {
                            for(let e2 = e; e2 > e - fileSize; e2--) {
                                // console.log(e2);
                                disk[e2] = '.';
                            }
                            for(let s2 = s; s2 < s + fileSize; s2++) disk[s2] = block;

                            break;
                        }
                    }
                }

                e = e - fileSize;
            }
            else e--;
        }

        return disk;
    }

    getSize(disk: string[], startIndex: number, reverse: boolean = false){
        let currentFile = disk[startIndex];
        let searchFile = currentFile;
        let searchIndex = startIndex;
        while(searchFile === currentFile) {
            if(reverse) searchIndex--;
            if(!reverse) searchIndex++;

            searchFile = disk[searchIndex];
        }

        return reverse ? startIndex - searchIndex : searchIndex - startIndex;
    }

    countData(defragmented: string[]) {
        let result = 0;

        for(let i = 0; i < defragmented.length; i++) {
            const char = defragmented[i];

            if(char.indexOf('.') >= 0) continue;

            let number = parseInt(char);
            let mul = i * number;
            result += mul;
        }

        return result;
    }

}



