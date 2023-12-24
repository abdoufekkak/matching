import { message } from "./message";
export class User {
  constructor(
    public username: string,
    public email: string,
    public age: number,
    public adress: string,
    public deleted: Date,
    public status: string,
    public id?: number
  ) {}
}
