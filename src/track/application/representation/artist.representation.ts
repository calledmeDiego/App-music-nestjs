import { Artist } from "src/track/domain/value-object/artist.vo"

export class ArtistRepresentation {
    private constructor(private readonly artist: Artist) { }

    public static fromArtist(artist: Artist): ArtistRepresentation {
        return new this(artist)
    }

    public format() {
        const artist = this.artist

        return {
            name : artist.name,
            nickname: artist.nickname,
            nationality: artist.nationality,
        }
    }
}