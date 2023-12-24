import { User } from "../model/User";
import { message } from "../model/message";
import { UserRepository } from "../repo/User";
import { MessageDB } from "../repo/message";
const pgp = require("pg-promise")();
require("dotenv").config();
const dbConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};
const db = pgp(dbConfig);
export class ServiceMessage {
  messageDB = new MessageDB();
  trepoclient = new UserRepository();
  constructor(repoclient: MessageDB) {
    this.messageDB = repoclient;
  }

  async save(req: any, res: any) {
    const user2 = (await this.trepoclient.getUserById(
      req.body.receiver_id
    )) as User;
    const user1 = (await this.trepoclient.getUserById(
      req.body.sender_id
    )) as User;
    if (user1 != null && user2 != null) {
      await this.messageDB
        .createMessage(req.body as message)
        .then((e) => {
          return res.status(200).send(e);
        })
        .catch((err) => console.log("Error in create Message", err));
    } else {
      return res.status(500).send("users not found");
    }
  }

  async delete_fo_all(req: any, res: any) {
    const message_id = req.params.id;
    if (message_id != null) {
      this.messageDB
        .deleteMessageAll(message_id)
        .then((e) => {
          return res.status(204).send(e);
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(500).send("message not found");
    }
  }
  async transfer_msg(req: any, res: any) {
    const { msg_id, usr_receiver } = req.body;
    const message = await this.messageDB.getMessageById(msg_id);
    const user2 = (await this.trepoclient.getUserById(usr_receiver)) as User;
    const user1 = (await this.trepoclient.getUserById(
      message.sender_id
    )) as User;
    console.log(user1 ,user2, message)
    if (!user1 || !user2 || !message) {
      return res.status(500).send("users or message not found.");
    } else {
      await this.messageDB
        .transferMessage(message, usr_receiver)
        .then((e) => {
          return res.status(200).send(e);
        })
        .catch((err) => console.log(err));
    }
  }
  async suppparmoi(req: any, res: any) {
    const message_id = req.params.id;
    if (message_id != null) {
      this.messageDB
        .deleteMessagemoi(message_id)
        .then((e) => {
          return res.status(204).send(e);
        })
        .catch((err) => console.log(err));
    } else {
      return res.status(500).send("message not found");
   
    }
  }
  async updatemssage(req: any, res: any) {
    try {
      const msg: message = req.body as message;
      const user1 =await this.trepoclient.getUserById(msg.sender_id);
      const user2 = await this.trepoclient.getUserById(msg.sender_id);

      if (!user1 || !user2) {
        return req.status(500).send("usersnotfound");
      }
      const mes =await this.messageDB.getMessageById(req.params.id);

      if (!mes) return res.status(500).send("msg not found");
      console.log(mes)
      const result = await this.messageDB.updateMessage(req.params.id, msg);
      
      console.log(result)
      if (result) {
        return res.status.send(result);
      } else {
        throw new Error("impossible");
      }
    } catch (e) {
      return res.status(500).send(e);
    }
  }
  
  async getmsgby2user(req: any, res: any) {
    try {
      const { sender_id, receiver_id } = req.query;
      const user1 = await this.trepoclient.getUserById(sender_id);
      const user2 = await this.trepoclient.getUserById(receiver_id);
      if (!user1 || !user2) {
        return res.status(404).send("Users not found");
      }
  
      const data = await this.messageDB.getAmisBy2user(sender_id, receiver_id);
      return res.status(200).json(data);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send("Internal Server Error");
    }
  }
  
}
