export abstract class DomainEvent { 
    public readonly eventId: string = '';
    public readonly eventName: string
    public readonly ocurredOn: Date = new Date();
}