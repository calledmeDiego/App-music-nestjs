export abstract class DomainEvent {
    public readonly ocurredOn: Date = new Date();
    constructor(public readonly eventName: string) {}
}