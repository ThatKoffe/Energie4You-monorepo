/**
 * Util middleware
 */

export default async function (req: any, res: any, next: Function) {
    res.format = (status: number, message: string, data?: any) => {
        return res.status(status).json({ status, message, ...data });
    };

    next();
}
