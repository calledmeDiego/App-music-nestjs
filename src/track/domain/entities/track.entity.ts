import { Artist } from "../value-object/artist.vo";
import { Duration } from "../value-object/duration.vo";

export class TrackEntity {
    constructor(
        public readonly id: string,
        public readonly name: string | null,
        public readonly album: string | null,
        public readonly cover: string | null,
        public readonly artist: Artist | null,
        public readonly duration: Duration | null,
        public readonly mediaId: string | null,
        public readonly createdAt: Date,
        public readonly updatedAt: Date
    ) { }
}