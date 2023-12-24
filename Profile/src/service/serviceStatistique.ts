import axios from "axios";
import { posts } from "../model/posts";
import { Statistique } from "../repo/statistique";
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
export class ServiceStatistique {
  staticRepo = new Statistique();
  constructor(repostatic: Statistique) {
    this.staticRepo = repostatic;
  }

  async GetStatistic(req: any, res: any) {
    const user_id = req.params.id;

    try {
      const likes = await this.staticRepo.GetNbrAime(user_id);
      const posts = await this.staticRepo.GetNbrPub(user_id);
      const friends = await this.staticRepo.GetNbrAmis(user_id);
      const status = await this.staticRepo.GetStatus(user_id);
      if (likes == null || posts == null || friends == null || status == null) {
        return res.status(500).send("Data not found");
      }

      const statistics = {
        likes: likes[0].sum,
        posts: posts[0].count,
        friends: friends[0].friend_count,
        status: status[0].status,
      };

      return res.status(200).json(statistics);
    } catch (e) {
      console.error("Error:", e);
      return res.status(500).send(e);
    }
  }
}
