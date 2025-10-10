import { DurationNullException } from "src/track/domain/exception/duration-null.exception";
import { Duration } from "src/track/domain/value-object/duration.vo";


export class DurationRepresentation {
    private constructor(private readonly duration: Duration) { }

    public static fromDuration(duration: Duration): DurationRepresentation {
        return new this(duration)
    }

    public format() {
        const duration = this.duration;

        return {
            start : duration.start,
            end : duration.end,
        }
    }
}