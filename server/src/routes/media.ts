/**
 * Media api routes
 */

import { Router } from "express";
import MediaBase from "../media/media";

const router = Router();

const mediaStorage = new MediaBase("report-media");

router.post("/", async (req: any, res: any) => {
    try {
        const mediaValue = await mediaStorage.saveMediaToUrl(
            req.body,
            req.headers["content-type"]
        );

        return res.format(200, "OK", { mediaValue });
    } catch (error: any) {
        return res.format(400, error?.message);
    }
});

export default router;
