/**
 * "Melding" mock database table
 */

import { EReportCategory, TReport } from "../types/reports";
import idEngine from "../util/idEngine";
import DataBase from "./data";

class Reports extends DataBase {
    constructor() {
        super("reports");
    }

    // get report by id
    getReport(id: string): TReport | null {
        return this.getKey(id);
    }

    // get all reports
    getReports(): TReport[] {
        const data = this.getValuesFromKeys(this.getKeys());

        // re-order by date (newest first)
        data.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        return data;
    }

    // create report with data
    createReport(data: {
        description: string;
        category: EReportCategory;
        img: string;
        gps: any;
        username: string;
    }): TReport {
        const id = idEngine();

        const report: TReport = {
            id,
            username: data.username,
            description: data.description,
            category: data.category,
            img: data.img,
            gps: data.gps,
            date: new Date().toISOString(),
            modified: new Date().toISOString(),
        };

        this.setKey(id, report);

        return report;
    }
}

export default new Reports();
