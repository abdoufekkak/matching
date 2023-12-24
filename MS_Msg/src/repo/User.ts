import { User } from "../model/User";

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
export class UserRepository {
  async createUser(user: User) {
    const insertQuery = `
          INSERT INTO users (username, email,age,address,status)
          VALUES ($[username], $[email],$[age], $[address],$[status])
          RETURNING *
        `;

    const result = await db.one(insertQuery, user);

    return result;
  }
  async GetAllUser() {
    const insertQuery = `
         select * from users order by id desc
        `;

    const datA = await db.query(insertQuery);
    return datA;
  }

  async getUserById(id: number) {
    const selectQuery = `
          SELECT * FROM users
          WHERE id = $[id] AND deleted is null
        `;

    const user = await db.oneOrNone(selectQuery, { id });

    return user;
  }
  async getIdByUsername(username: string) {
    const selectQuery = `
    SELECT id FROM users
    WHERE username = $[username] AND deleted is null
    `;
    const id = await db.oneOrNone(selectQuery, { username });
    return id;
  }
  async getUserByUsername(username: string) {
    const selectQuery = `
    SELECT * FROM users
    WHERE username = $[username] AND deleted is null
    `;

    const user = await db.oneOrNone(selectQuery, { username });

    return user;
  }


  async recherchinvit(id:number){
    console.log(id)
    const q=`select usertoutal.id from users as usertoutal where usertoutal.id!=$[id] EXCEPT 
    (SELECT users2.id FROM users as users1,relation,users as  users2
       WHERE   users1.id=relation.user_id and
        users2.id=relation.friend_id and relation.type_relation='ami' 
         and users1.id =$[id] union SELECT users1.id
         FROM users as users1,relation,users as  users2
       WHERE   users1.id=relation.user_id and
        users2.id=relation.friend_id and relation.type_relation='ami'  and users2.id=$[id])`
        const data = await db.query(q, { id: id });
        const  dat:number[]= data.map((e:any)=>e.id)
        console.log(dat)
       const q2="select * from users where id = ANY($1)"
     const data2=  await db.query(q2,  [dat]);
        return data2;
      }
  async getAmisByIduser(id: number) {
    const selectQuery = `
    SELECT users2.id,users2.email,users2.username, users2.age
    ,users2.address, users2.status FROM users as users1,relation,users as  users2
   WHERE   users1.id=relation.user_id and
    users2.id=relation.friend_id and relation.type_relation='ami' and is_accepted=true and users1.id = $[id] union SELECT users1.id,users1.email,users1.username, users1.age
    ,users1.address ,users1.status FROM users as users1,relation,users as  users2
   WHERE   users1.id=relation.user_id and
    users2.id=relation.friend_id and relation.type_relation='ami' and is_accepted=true and users2.id=$[id]`;
    const data = await db.query(selectQuery, { id: id });

    return data;

  }
  async accepted_invit(user_id: number, friend_id: number) {
    const query = `
      UPDATE relation
      SET is_accepted = true
      WHERE user_id = $1 AND friend_id = $2
    `;
  
    const data = await db.query(query, [user_id, friend_id]);
  }
  async deleted_invit(user_id: number, friend_id: number) {
    const query = `
    DELETE FROM relation
    WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)    
    `;
  
    const data = await db.query(query, [user_id, friend_id]);
  }
  async getinvitation(id:number){
    const  ff=`SELECT users2.id,users2.email,users2.username, users2.age
    ,users2.address FROM relation,users as  users2
   WHERE   
    users2.id=relation.user_id and relation.type_relation='ami'
	and relation.friend_id =$[id] and relation.is_accepted=false`
  const data = await db.query(ff, { id: id });
  return data;
  }
  async updateUser(id: number, updatedUserData: User) {
    const updateQuery = `
          UPDATE users
          SET username = $[username], email = $[email], age = $[age], address = $[address],status=$[status]
          WHERE id = $[id]
        `;

    updatedUserData.id = id; // Ajoutez également l'ID aux données mises à jour

    const result = await db.result(
      updateQuery,
      updatedUserData,
      (r: { rowCount: number }) => r.rowCount
    );
    //number de ligne
    return result === 1;
  }

  async deleteUser(id: number) {
    const updateQuery = `
        UPDATE users
        SET deleted = NOW()
        WHERE id = $[id]
      `;

    const result = await db.result(
      updateQuery,
      { id },
      (r: { rowCount: any }) => r.rowCount
    );
    return result === 1;
  }
  async filterUsersByAgeAddress(age: number, address: string) {
    let touta = ``;
    const params = [];
    if (age) {
      touta += "AND age = $1";
      params.push(age);
    }
    if (address && !age) {
      touta += "AND address LIKE $1";
      params.push(`%${address}%`);
    }
    if (address && age) {
      touta += "AND address LIKE $2";
      params.push(`%${address}%`);
    }
    const selectQuery = `
          SELECT * FROM users
          WHERE deleted is null   ${touta}
        `;

    const users = await db.query(selectQuery, params);

    return users;
  }
  async envoyerinvite(relation:any){
    const insertQuery = `
          INSERT INTO relation (user_id, friend_id,type_relation,is_accepted)
          VALUES ($[user_id], $[friend_id],$[type_relation], $[is_accepted])
          RETURNING *
        `;

    const result = await db.one(insertQuery, relation); 
  return result }
}
