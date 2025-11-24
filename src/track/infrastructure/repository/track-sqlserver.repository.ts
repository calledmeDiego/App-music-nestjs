import { Injectable } from "@nestjs/common";

import { SqlServerPrismaService } from "src/shared/infrastructure/prisma/services/sqlserver-prisma.service";
import { TrackEntity } from "src/track/domain/entities/track.entity";
import { TrackRepository } from "src/track/domain/repository/track.repository";

@Injectable()
export class TrackSqlServerRepository implements TrackRepository {
    constructor(private readonly prismaService: SqlServerPrismaService) { }

    async create(track: TrackEntity): Promise<TrackEntity> {
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
                start: Number(track.duration.start!),
                end: Number(track.duration.end!),
            })
            durationId = durationGenerated;
        }

        const createdTrack = await this.prismaService.tracks.create({
            data: {
                name: track.name,
                album: track.album,
                cover: track.cover,
                artistId,
                durationId,
                mediaId: track.mediaId || null,
                deletedAt: null
            },
            include: {
                artist: true,
                duration: true,
            }

        });

        return TrackEntity.FromDbToEntityParse(createdTrack);
    }

    async findById(id: string): Promise<TrackEntity | null> {
        const foundTrack = await this.prismaService.tracks.findUnique({
            where: {
                id
            },
            include: {
                artist: true,
                duration: true,
            }
        })
        if (!foundTrack) return null;

        return TrackEntity.FromDbToEntityParse(foundTrack);

    }

    async list(): Promise<TrackEntity[]> {
        const allTracks = await this.prismaService.tracks.findMany({
            where: { deletedAt: null },
            include: {
                artist: true,
                duration: true,
                media: true
            }
        });

        return allTracks.map((t) => {
            return TrackEntity.FromDbToEntityParse(t)
        });
    }

    async update(id: string, track: TrackEntity): Promise<TrackEntity> {

        const artistId = await this.findOrCreateorUpdateArtist({
            name: <string>track.artist?.name,
            nickname: <string>track.artist?.nickname,
            nationality: <string>track.artist?.nationality,
        });
        const updatedTrack = await this.prismaService.tracks.update({
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
                        start: Number(track.duration.start!),
                        end: Number(track.duration.end!)
                    },
                } : undefined,
                media: track.mediaId ? {
                    connect: { id: track.mediaId }
                }: undefined,
                deletedAt: track.deletedAt
            },
            include: {
                artist: true,
                duration: true
            }
        });

        return TrackEntity.FromDbToEntityParse(updatedTrack);
    }

    async softDelete(id: string): Promise<any> {

        const deletedTrack = await this.prismaService.tracks.update({
            where: { id },
            data: { deletedAt: new Date() }
        });

        return 
    }

    async findOrCreateorUpdateArtist(artist: {
        name: string,
        nickname: string,
        nationality: string
    }) {
        const existingArtist = await this.findArtist(artist.name);

        let artistId: string | null;

        if (existingArtist) {
            const updatedArtist = await this.prismaService.artist.update({
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

            const createdArtist = await this.prismaService.artist.create({
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
        const artistCreated = await this.prismaService.artist.findFirst({
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
        const durationCreated = await this.prismaService.duration.create({
            data: {
                start: duration.start,
                end: duration.end,
            },
        });
        return durationCreated.id;
    }

}