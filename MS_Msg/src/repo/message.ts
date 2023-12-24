import { message } from "../model/message";
import { generateUpdaters } from '../utils/setting';
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

export class MessageDB {
  // Fonction pour insérer un message
  async createMessage(message: message) {
    const insertQuery = `
      INSERT INTO messages (sender_id, receiver_id, content, send_date, contry_msg, message_type)
      VALUES ($[sender_id], $[receiver_id], $[content], NOW(), $[contry_msg], $[message_type])
      RETURNING *

      `;
    message = await db.one(insertQuery, message);
    console.log(message);
    return message;
  }

  async GetAllmsg() {
    const insertQuery = `
     select * from messages order by id desc
    `;

    const date = await db.query(insertQuery);
    return date;
  }
  // Fonction pour récupérer un message par son ID
  async getMessageById(id: number) {
    const selectQuery = `
      SELECT * FROM messages
      WHERE id = $1
    `;

    const message = await db.oneOrNone(selectQuery, id);
    return message;
  }

  // Fonction pour mettre à jour un message par son ID
  async updateMessage(id: number, updatedMessage: message) {
const updaters =  generateUpdaters(Object.keys(updatedMessage))
    const updateQuery = `
      UPDATE messages
      SET ${updaters}
      WHERE id = $[id]
    `;
      updatedMessage.id = id; // Ajoutez également l'ID aux données mises à jour
      console.log('----',updaters,updatedMessage)

    console.log(updateQuery)
    const result = await db.result(
      updateQuery,
      updatedMessage,
      (r: { rowCount: number }) => r.rowCount
    );
    return result === 1;
  }

  // Fonction pour supprimer un message par son ID
  async deleteMessageAll(id: number) {
    const updateQuery = `
      UPDATE messages
      SET deleted_al = NOW()
      WHERE id = $1
    `;

    await db.none(updateQuery, id);
  }
  async deleteMessagemoi(id: number) {
    const updateQuery = `
      UPDATE messages
      SET deleted_fr_me = NOW()
      WHERE id = $1
    `;

    await db.none(updateQuery, id);

  }

  async getAmisBy2user(sender_id: number, receiver_id: number) {
    const selectQuery = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) AND deleted_al is null
      ORDER BY send_date ASC;
    `;
    const data = await db.query(selectQuery, [sender_id, receiver_id ]);
    return data;
  }
  async transferMessage(messageId: message, newreceiver_id: number) {
    const updatedMessage = { ...messageId, receiver_id: newreceiver_id };
    const insertQuery = `
      INSERT INTO messages (sender_id, receiver_id, content, send_date, contry_msg, deleted_al, deleted_fr_me, message_type)
      VALUES ($[sender_id], $[receiver_id], $[content], $[send_date], $[contry_msg], $[deleted_al], $[deleted_fr_me], $[message_type])
    `;

    return await db.none(insertQuery, updatedMessage);
  }
}
