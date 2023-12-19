import path from "path";
import fs from "fs";
import { MEDIA_ROOT, allowedMediaContentTypes } from "../config";
import sharp from "sharp";

//? Media Storage
export default class MediaBase {
    storageId: string;

    constructor(storageId: string) {
        this.storageId = `.app-cdn.${storageId}`;

        //? init storage
        this.initStorage();
    }

    private getStoragePath(): string {
        return path.join(__dirname, "..", "public", `${this.storageId}`);
    }

    private initStorage(): void {
        const storagePath = this.getStoragePath();

        // check if storage path exists
        if (!fs.existsSync(storagePath)) {
            fs.mkdirSync(storagePath);
        }
    }

    async saveMediaToUrl(dataBody: any, contentType: string): Promise<string> {
        let mediaValue: string;

        // check if content type is allowed
        if (!contentType) throw new Error("No content type provided");

        if (!allowedMediaContentTypes.includes(contentType))
            throw new Error("Content type not allowed");

        // check if data body is provided
        if (!dataBody) throw new Error("No data provided");

        // check if databody is buffer
        const storagePath = this.getStoragePath();

        // check if data body is buffer
        if (dataBody instanceof Buffer) {
            let fileName = `${Date.now()}.${contentType.split("/")[1]}`;
            let filePath = path.join(storagePath, fileName);

            let sharped: sharp.Sharp;

            // check if content type is gif
            if (contentType.includes("gif")) {
                sharped = sharp(dataBody, {
                    animated: true,
                });

                //? resize gif
                await sharped.toFile(filePath);
            } else if (contentType.includes("video")) {
                throw new Error("Video upload not supported yet");
            } else {
                sharped = sharp(dataBody);

                //? resize image
                await sharped.toFile(filePath);
            }

            //? save media to url
            mediaValue = `${MEDIA_ROOT}/${this.storageId}/${fileName}`;
        } else {
            throw new Error("Data is not a buffer");
        }

        return mediaValue;
    }
}
