import { randomUUID } from "crypto"
import { UUIDException } from "../exception/uuid.exception";

export class Uuid  {
  private uuidV4Regex =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i

    readonly value: string;
  public constructor(value: string) {
      this.isValid(value)
      this.value = value;
  }

  public static create() {
    return new this(randomUUID().toString());
  }

  public static fromString(value: string): Uuid {
    return new this(value)
  }

  private isValid(value: string): void {
    if (!new RegExp(this.uuidV4Regex).test(value)) {
      throw new UUIDException(); 
    }
  }
}