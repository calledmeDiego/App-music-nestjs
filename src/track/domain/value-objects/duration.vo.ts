export class Duration {
    readonly start: string;
    readonly end: string
    constructor(start:number | null,end: number | null) {  
        this.start = start ? start.toString(): '0';
        this.end = end ? end.toString(): '';
    }

    static create({start,end}:{start?: number, end?: number}) {
        if (start && end && start > end) {
            throw new Error('Duration start cannot be greater than end');
        }
        return new Duration(start ?? null, end ?? null);

    }

    get total(): number | null {
        if (this.start !== null && this.end !== null) {
            return Number(this.end) - Number(this.start);
        }

        return null;
    }
}