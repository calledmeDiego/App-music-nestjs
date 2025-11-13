export class Duration {
    /**
     *
     */
    constructor(public readonly start:number | null, public readonly end: number | null) {       
    }

    static create(start?: number, end?: number) {
        if (start && end && start > end) {
            throw new Error('Duration start cannot be greater than end');
        }
        return new Duration(start ?? null, end ?? null);

    }

    get total(): number | null {
        if (this.start !== null && this.end !== null) {
            return this.end - this.start;
        }

        return null;
    }
}