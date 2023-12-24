import express from "express";
import { ServicePost } from "../service/servicePosts";
const router = express.Router();
import { PostDB } from "../repo/posts";
const postRepository = new PostDB();
const servicePost = new ServicePost(postRepository);

router.post("/", (req: any, res: any) => {
  servicePost.createPost(req, res);
});
router.post("/react/:id", (req: any, res: any) => {
  // return res.status(200).json("ok")
  servicePost.reactPost(req, res);
});
router.get("/all", (req: any, res: any) => {
  servicePost.GetAllposts(req, res);
});
router.get("/:id", (req: any, res: any) => {
  servicePost.GetAllpost(req, res);
});
// router.post("/", (req: any, res: any) => {
//     servicePost.save(req, res);
//   });

router.delete("/:id", (req: any, res: any) => {
  servicePost.deletePost(req, res);
});

module.exports = router;
