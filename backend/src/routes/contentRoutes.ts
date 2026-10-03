import { Router } from "express";
import { ContentController } from "../controllers/contentController";

const router = Router();

router.get("/categories", ContentController.getCategories);
router.get("/collections", ContentController.getCollections);
router.get("/articles", ContentController.getContentList);
router.get("/articles/:slug", ContentController.getContentBySlug);
router.get("/sitemap.xml", ContentController.getSitemapXml);
router.get("/robots.txt", ContentController.getRobotsTxt);

export default router;
