export class Artist {
    readonly name: string;
    readonly nickname: string;
    readonly nationality: string;
    
    constructor(name?: string,nickname?: string, nationality?: string){
        this.name = name ? name : '';
        this.nickname = nickname ? nickname : '';
        this.nationality = nationality ? nationality : '';
    }

    static create({name,nickname,nationality}: {name?: string, nickname?: string, nationality?: string}){
        return new Artist(name , nickname , nationality);
    } 
}