import { TrackEntity } from "../entities/track.entity";

export interface TrackRepository {
    create(track: TrackEntity): Promise<TrackEntity>;
    findById(id: string): Promise<TrackEntity| null>;
    list(): Promise<TrackEntity[]>;
    update(id: string, track: TrackEntity): Promise<any>;
    softDelete(id: string): Promise<any>;
}