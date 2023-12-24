import { User } from "../model/User";
import { UserRepository } from "../repo/User";
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
export class ServiceUser {
  repoclient = new UserRepository();
  constructor(repoclient: UserRepository) {
    this.repoclient = repoclient;
  }
  users(req: any, res: any) {
    this.repoclient
      .GetAllUser()
      .then((e) => {
        return res.status(200).send(e);
      })
      .catch((err) => console.log(err));
  }

  async getbyId(req: any, res: any) {
    const username = req.params.id;

    const user2 = (await this.repoclient.getUserById(username)) as User;
    if (user2 == null) {
      return res.status(500).send("this user not existe");
    } else {
      res.status(200).send(user2);
    }
  }
  async getbyUsername(req: any, res: any) {
    const username = req.params.username;

    const user2 = (await this.repoclient.getUserByUsername(username)) as User;
    if (user2 == null) {
      return res.status(500).send("this user not existe");
    } else {
      res.status(200).send(user2);
    }
  }

  async supp(req: any, res: any) {
    const userId = req.params.id;

    try {
      const rowCount = await this.repoclient.deleteUser(userId);

      if (rowCount) {
        return res.status(200).send("Utilisateur supprimé avec succès");
      }
    } catch (err) {
      return res.status(500).send(err);
    }
  }
  async update(req: any, res: any) {
    const postId = req.params.id;
    const user: User = req.body as User;
    const user2 = (await this.repoclient.getUserById(postId)) as User;
    if (user2 == null) {
      return res.status(500).send("this user not exist");
    } else {
      const result = await this.repoclient.updateUser(postId, user);
      res.status(200).send(result);
    }
  }
  async save(req: any, res: any) {
    const user = await this.repoclient.getUserByUsername(req.body.username);
    if (user != null) {
      return res.status(500).send("this userName existe");
    } else {
      await this.repoclient
        .createUser(req.body as User)
        .then((e) => {
          return res.status(200).send(e);
        })
        .catch((err) => console.log(err));
    }
  }
  async Filter(req: any, res: any) {
    try {
      const { age, address } = req.body;
      const results: User[] = await this.repoclient.filterUsersByAgeAddress(
        age,
        address
      );
      const count = results.length;
      return res.status(200).json({ results, count });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  async AmisById(req: any, res: any) {
    try {
      const id = req.params.id;
      const results: User[] = await this.repoclient.getAmisByIduser(id);
      const count = results.length;
      return res.status(200).json(results);
    } catch (error) {
      return res.status(500).send(error);
    }
  }

  async geIdbyUsername(req: any, res: any) {
    const username = req.body.username;

    const id = (await this.repoclient.getIdByUsername(username)) as User;
    if (id == null) {
      return res.status(500).send("this user not existe");
    } else {
      res.status(200).send(id);
    }
  }

  async getinvitation(req:any,res:any){

    const iduser=req.params.id;
    const user2 = (await this.repoclient.getUserById(iduser)) as User;
    if (user2 == null) {
      return res.status(500).send("this user not exist");
  }
const data=  await this.repoclient.getinvitation(iduser);
res.status(200).send(data);

}
async accepted_invit(req:any,res:any){
  console.log(req.body)
const data=await this.repoclient.accepted_invit( req.body.user_id, req.body.friend_id);
    return res.status(200).send({ok:"ok"});
}

async deleted_invit(req:any,res:any){
  console.log(req.body)
const data=await this.repoclient.deleted_invit( req.body.user_id, req.body.friend_id);
    return res.status(200).send({ok:"ok"});
}

async getivn(req:any,res:any){
  try{
    const data=await this.repoclient.recherchinvit(req.params.id);
return res.status(200).json(data)
  }catch(e){
    return res.status(500).json(e)
  }
}

async envoyerinvite(req:any,res:any){
  try{
    const data=await this.repoclient.envoyerinvite(req.body);
return res.status(200).json(data)
  }catch(e){
    console.log(e)
    return res.status(500).json(e)

  }
}
}
