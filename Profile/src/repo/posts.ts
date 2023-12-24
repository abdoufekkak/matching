import { posts } from "../model/posts";
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

export class PostDB {
  // Fonction pour insérer un Post
  async createPost(post: posts) {
    const insertQuery = `
  INSERT INTO posts (url_img, date_pub, content, id_user, nbr_like)
  VALUES ($[url_img], NOW(), $[content], $[id_user], 0)
  RETURNING *;
`;
    const result = await db.one(insertQuery, post);
    console.log(post);
    return result;
  }

  async GetAllpost(id_user: number) {
    const insertQuery = `
    select * from posts where id_user=$1 AND date_sup is null  order by id desc
   `;

    const date = await db.query(insertQuery, id_user);
    return date;
  }
  async GetAllposts(id: number, last_post_date: number) {
    var filter =''
    var l = [id]
    console.log(id, last_post_date);
    if(last_post_date >-1){
      filter = 'AND p.id < $2'
      l.push(last_post_date)  
      }

    const insertQuery = `  
    SELECT T.*
    FROM (
      SELECT p.*, u.username as user_name
      FROM posts p
      INNER JOIN relation r ON p.id_user = r.friend_id
      INNER JOIN users u ON p.id_user = u.id
      WHERE r.user_id = $1 ${filter}
      UNION
      SELECT p.*, u.username as user_name
      FROM posts p
      INNER JOIN users u ON p.id_user = u.id
      WHERE p.id_user = $1 ${filter} 
    ) T
    ORDER BY T.id DESC -- Tri par ordre décroissant de la colonne "id" de la sous-requête
    LIMIT 10;
    
    
 `;

    const date = await db.query(insertQuery, l);
    console.log(date);

    return date;
  }
  // Fonction pour récupérer un Post par son ID
  async getPostById(id: number) {
    const selectQuery = `
    SELECT * FROM posts
    WHERE id = $[id] AND date_sup is null
    `;

    const post = await db.oneOrNone(selectQuery, { id });

    return post;
  }

  // Fonction pour mettre à jour un Post par son ID

  // Fonction pour supprimer un Post par son ID
  async deletePost(id: number) {
    const updateQuery = `
    UPDATE posts
    SET date_sup= NOW()
    WHERE id = $[id]
  `;

    const result = await db.result(
      updateQuery,
      { id },
      (r: { rowCount: any }) => r.rowCount
    );
    return result === 1;
  }

  async reactPost1(id_user: number, id_post: number) {
    const react = 'INSERT INTO "likes" (id_post, id_user) VALUES($1, $2)';
    await db.none(react, [id_post, id_user]);
  }

  async reactPost2(id_post: number) {
    const updateQuery = `
    UPDATE posts
    SET nbr_like=nbr_like+1
    WHERE id = $[id_post] AND date_sup is null 
  `;
    const result = await db.result(
      updateQuery,
      { id_post },
      (r: { rowCount: any }) => r.rowCount
    );
    return result === 1;
  }

  async getlike(id_user: number, id_post: number) {
    console.log(id_post);
    const insertQuery = `
    select * from likes where id_user=$1 AND id_post=$2`;

    const date = await db.query(insertQuery, [id_user, id_post]);
    console.log(date);
    return date[0];
  }
}
