/**
 * Types for reports
 */

export type TReport = {
    id: string;
    username: string;
    description: string;
    category: EReportCategory;
    img: string;
    gps: any;
    date: string;
    modified: string;
};

export enum EReportCategory {
    Grondkabels = "Grondkabels",
    Hoogspanningsmasten = "Hoogspanningsmasten",
    Luchtkabels = "Luchtkabels",
    Schakelkasten = "Schakelkasten",
}
