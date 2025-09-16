export class Artist {
    constructor(public readonly name?: string, public readonly nickname?: string, public readonly nationality?: string){}

    static create(props: {name?: string, nickname?: string, nationality?: string}){
        return new Artist(props.name , props.nickname , props.nationality);
    }
}