enum MessageType {
    Text,
    Audio,
    video
  }
export class message {
    constructor(
      public sender_id: number,
      public receiver_id: number,
      public content: string,
      public send_date:Date,
      public message_type: MessageType,
      public contry_msg:string,
      public deleted_al?:Date,
      public deleted_fr_me?:Date,
      public id?: number,
    ) {}
  }