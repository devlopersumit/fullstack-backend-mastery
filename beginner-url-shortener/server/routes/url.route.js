import express from "express";
import { createShortUrl, redirectToOriginalUrl } from "../controllers/url.controller.js";

const router = express.Router();

router.post('/api/shorten', createShortUrl);
router.get('/:shortId', redirectToOriginalUrl);

export default router;