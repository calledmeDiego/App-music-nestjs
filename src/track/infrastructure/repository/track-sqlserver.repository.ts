import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/shared/infrastructure/prisma/services/prisma.service";
import { TrackEntity } from "src/track/domain/entities/track.entity";
import { TrackRepository } from "src/track/domain/repository/track.repository";

@Injectable()
export class TrackSqlServerRepository implements TrackRepository {
    constructor(private readonly prismaService: PrismaService) {

    }

    async create(track: TrackEntity): Promise<any> {
        let artistId: string | undefined;
        let durationId: string | undefined;

        if (track.artist) {
            const artistIdGenerated = await this.findOrCreateorUpdateArtist({
                name: track.artist.name!,
                nickname: track.artist.nickname!,
                nationality: track.artist.nationality!,
            })
            artistId = artistIdGenerated;
        }

        if (track.duration) {
            const durationGenerated = await this.createDuration({
                start: track.duration.start!,
                end: track.duration.end!,
            })
            durationId = durationGenerated;
        }


        const createdTrack = await this.prismaService.sql.tracks.create({
            data: {
                name: track.name,
                album: track.album,
                cover: track.cover,
                artistId,
                durationId,
                mediaId: track.mediaId,
                deletedAt: null
            },
            include: {
                artist: true,
                duration: true,
                media: true,
            }

        });

        const media = createdTrack.media;
        return { ...TrackEntity.ShowJSON(createdTrack),
            media
         };
    }

    async findById(id: string): Promise<any> {
        const foundTrack = await this.prismaService.sql.tracks.findUnique({
            where: {
                id
            },
            include: {
                artist: true,
                duration: true,
                media: true
            }
        })
        if (!foundTrack) {
            throw new NotFoundException(`Track with id ${id} not found`);
        }
        const media = foundTrack.media;

        return {...TrackEntity.ShowJSON(foundTrack),
           media
        }
    }

    async list(): Promise<any[]> {
        const allTracks = await this.prismaService.sql.tracks.findMany({
            where: { deletedAt: null },
            include: {
                artist: true,
                duration: true,
                media: true
            }
        });

        return allTracks.map((t) => ({...TrackEntity.ShowJSON(t),
            media: t.media
        }));
    }

    async update(id: string, track: TrackEntity): Promise<any> {
        const foundTrack = await this.findById(id)

        if (!foundTrack) {
            throw new NotFoundException(`Track with id ${id} not found`);
        }
        const artistId = await this.findOrCreateorUpdateArtist({
            name: <string>track.artist?.name,
            nickname: <string>track.artist?.nickname,
            nationality: <string>track.artist?.nationality,
        });

        const updatedTrack = await this.prismaService.sql.tracks.update({
            where: { id },
            data: {
                name: track.name,
                album: track.album,
                cover: track.cover,

                artist: {
                    connect: { id: artistId }
                },
                duration: track.duration ? {

                    update: {
                        start: track.duration.start,
                        end: track.duration.end
                    },
                } : undefined,
                media: {
                    connect: { id: <string>track.mediaId }
                },
                deletedAt: track.deletedAt
            }
        });
        try {
            return TrackEntity.ShowJSON(updatedTrack)
        } catch (error) {
            throw new HttpException('Error al actualizar el track', HttpStatus.FORBIDDEN);
        }
    }

    async softDelete(id: string): Promise<any> {
        const foundTrack = await this.findById(id);

        if (!foundTrack) {
            throw new NotFoundException(`Track with id ${id} not found`);
        }

        await this.prismaService.sql.tracks.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

        return TrackEntity.ShowJSON(foundTrack)
    }

    async findOrCreateorUpdateArtist(artist: {
        name: string,
        nickname: string,
        nationality: string
    }) {
        const existingArtist = await this.findArtist(artist.name);

        let artistId: string | null;

        if (existingArtist) {
            const updatedArtist = await this.prismaService.sql.artist.update({
                where: {
                    id: existingArtist.id
                },
                data: {
                    nickname: artist.nickname,
                    nationality: artist.nationality,
                }
            });

            artistId = updatedArtist.id;
        } else {

            const createdArtist = await this.prismaService.sql.artist.create({
                data: {
                    name: artist.name,
                    nickname: artist.nickname,
                    nationality: artist.nationality,
                },
            });
            artistId = createdArtist.id;
        }
        return artistId;
    }

    async findArtist(artist: string) {
        const artistCreated = await this.prismaService.sql.artist.findFirst({
            where: {
                name: {
                    equals: artist,
                }
            }
        });
        return artistCreated;
    }

    async createDuration(duration: {
        start: number,
        end: number
    }) {
        const durationCreated = await this.prismaService.sql.duration.create({
            data: {
                start: duration.start,
                end: duration.end,
            },
        });
        return durationCreated.id;
    }

}