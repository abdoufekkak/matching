import express from "express";
import { ServiceStatistique } from "../service/serviceStatistique";
import { Statistique } from "../repo/statistique";
const router = express.Router();
const staticRepository = new Statistique();
const servicestatic = new ServiceStatistique(staticRepository);

router.get("/:id", (req: any, res: any) => {
  servicestatic.GetStatistic(req, res);
});

module.exports = router;
