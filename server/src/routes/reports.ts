/**
 * Reports api routes
 */

import { Router } from "express";
import report from "../db/report";

const router = Router();

/**
 * Import controllers
 */

router.get("/", (req: any, res: any) => {
    // Send list of reports
    return res.format(200, "OK", {
        list: report.getReports(),
    });
});

router.get("/:id", (req: any, res: any) => {
    const id = req.params.id;

    // check if id is valid
    const reportData = report.getReport(id);

    // Send error if report is not found
    if (!reportData) {
        return res.format(404, "Report not found");
    }

    // Send report data
    return res.format(200, "OK", { report: reportData });
});

router.post("/", (req: any, res: any) => {
    try {
        const { content, imageUrl, category, gps } = req.body;

        // validate data
        if (!content) return res.format(400, "Geef een omschrijving op");

        if (!imageUrl) return res.format(400, "Geen afbeelding gevonden");

        if (content.length > 2000)
            return res.format(400, "Omschrijving is te lang");

        if (!category) return res.format(400, "Geef een categorie op");

        if (!gps) return res.format(400, "Geef een locatie op");

        // create report
        const reportData = report.createReport({
            description: content,
            category,
            img: imageUrl,
            gps,
            username: "Bob",
        });

        return res.format(200, "OK", { report: reportData });
    } catch (error) {
        console.trace(error);
        return res.format(500, "Internal server error");
    }
});

export default router;
