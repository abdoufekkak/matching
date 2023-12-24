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
export class Statistique {
  async GetNbrAime(id_user: number) {
    const insertQuery =
      "select sum(nbr_like) from posts where id_user = $1 AND date_sup is null";
    const data = await db.query(insertQuery, id_user);
    return data;
  }
  async GetNbrPub(id_user: number) {
    const selectQuery =
      "SELECT COUNT(*) FROM posts WHERE id_user = $1 AND date_sup is null";
    const result = await db.query(selectQuery, id_user);
    return result;
  }

  async GetNbrAmis(userId: number) {
    const countQuery = `
    SELECT COUNT(*) as friend_count
    FROM (
      SELECT users2.id, users2.email, users2.username, users2.age, users2.address
      FROM relation, users as users2
      WHERE
        users2.id = relation.friend_id
        AND relation.type_relation = 'ami'
        AND relation.user_id =$1
        AND relation.is_accepted = true
		UNION 
	SELECT users2.id, users2.email, users2.username, users2.age, users2.address
      FROM relation, users as users2
      WHERE
        users2.id = relation.user_id
        AND relation.type_relation = 'ami'
        AND relation.friend_id =$1
        AND relation.is_accepted = true
    ) AS subquery;
  `;

    const result = await db.query(countQuery, [userId]);
    return result;
  }

  async GetNoteUser(id_user: number) {
    const selectQuery = "";
    const result = await db.query(selectQuery, id_user);
    return result;
  }

  async GetDuree(id_user: number) {
    const selectQuery = "";
    const result = await db.query(selectQuery, id_user);
    return result;
  }
  async GetStatus(id_user: number) {
    const selectQuery =
      "SELECT status FROM users WHERE id = $1 AND deleted is null";
    const result = await db.query(selectQuery, id_user);
    return result;
  }
}
