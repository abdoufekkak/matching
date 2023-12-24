import express from "express";
import { ServiceUser } from "../service/serviceUser";
const router = express.Router();
import { UserRepository } from "../repo/User";
const userRepository = new UserRepository();
const serviceUser = new ServiceUser(userRepository);

router.get("/", (req: any, res: any) => {
  serviceUser.users(req, res);
});
router.get("/inviter/:id", (req: any, res: any) => {
  serviceUser.getivn(req, res);
});
router.get('/amis/:id', async (req, res) => {
  serviceUser.AmisById(req, res);
});
router.get('/filter', async (req, res) => {
  serviceUser.Filter(req, res);


});
router.get("/username/:username", (req: any, res: any) => {
  serviceUser.getbyUsername(req, res);
});
router.get("/invite/:id", (req: any, res: any) => {
  serviceUser.getinvitation(req, res);
});
router.get("/:id", (req: any, res: any) => {
  serviceUser.getbyId(req, res);
});
router.post("/", (req: any, res: any) => {
  serviceUser.save(req, res);
});
router.post("/envoiInvita", (req: any, res: any) => {
  serviceUser.envoyerinvite(req, res);
});
router.delete("/:id", (req: any, res: any) => {
  serviceUser.supp(req, res);
});

router.put("/:id", (req: any, res: any) => {
  serviceUser.update(req, res);
});
router.post("/login", (req: any, res: any) => {
  serviceUser.geIdbyUsername(req, res);
});

router.post("/accepter", (req: any, res: any) => {
  serviceUser.accepted_invit(req, res);
});
router.post("/refus_invit", (req: any, res: any) => {
  serviceUser.deleted_invit(req, res);
});

module.exports = router;
