import fs from "fs";
import path from "path";

/**
 * This class is a mock database. It is used to store data in memory.
 */

export default class DataBase {
    storageId: string;

    constructor(storageId: string) {
        this.storageId = storageId;

        this.initStorage();
    }

    private getStoragePath(): string {
        return path.join(__dirname, ".localStorage", `${this.storageId}.json`);
    }

    private initStorage(): void {
        const storagePath = this.getStoragePath();

        // check if storage path exists
        if (!fs.existsSync(storagePath)) {
            fs.writeFileSync(storagePath, "{}");
        }
    }

    private readStorage(): any {
        const storagePath = this.getStoragePath();

        return JSON.parse(fs.readFileSync(storagePath, "utf-8"));
    }

    private writeStorage(data: any): void {
        const storagePath = this.getStoragePath();

        fs.writeFileSync(storagePath, JSON.stringify(data));
    }

    getKey(key: string): any {
        const data = this.readStorage();

        return data[key];
    }

    // set key and value
    setKey(key: string, value: any): any {
        const data = this.readStorage();

        data[key] = value;

        this.writeStorage(data);

        return data;
    }

    // delete key
    deleteKey(key: string): any {
        const data = this.readStorage();

        delete data[key];

        this.writeStorage(data);

        return data;
    }

    // get all keys from storage
    getKeys(): string[] {
        const data = this.readStorage();
        return Object.keys(data);
    }

    // get all values from storage
    getValuesFromKeys(keys: string[]): any[] {
        const data = this.readStorage();
        const values: any[] = [];

        keys.forEach((key) => {
            values.push(data[key]);
        });

        return values;
    }
}
