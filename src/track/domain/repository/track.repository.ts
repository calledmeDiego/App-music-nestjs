import { TrackEntity } from "../entities/track.entity";

export interface TrackRepository {
    create(track: TrackEntity): Promise<any>;
    findById(id: string): Promise<any>;
    list(): Promise<any[]>;
    update(id: string, track: TrackEntity): Promise<any>;
    softDelete(id: string): Promise<any>;
}