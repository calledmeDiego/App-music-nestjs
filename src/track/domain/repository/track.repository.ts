import { Uuid } from "src/shared/domain/value-object/Uuid.vo";
import { TrackEntity } from "../entities/track.entity";

export interface TrackRepository {
    create(track: TrackEntity): Promise<TrackEntity>;
    findById(id: Uuid): Promise<TrackEntity| null>;
    list(): Promise<TrackEntity[]>;
    update(id: Uuid, track: TrackEntity): Promise<TrackEntity>;
    softDelete(id: Uuid): Promise<any>;
}

export const trackRepositoryName = 'TrackRepository';