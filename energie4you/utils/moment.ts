import moment from "moment";

export function momented(date: Date) {
    //? keep all dates across the app in the same format
    return moment(date).format("DD/MM/YYYY");
}
