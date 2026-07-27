import { dbPromise } from "./uploadDB";

export const getUploads = async () => {
    const db = await dbPromise;
    return await db.getAll("uploads");
};

export const saveUpload = async (upload) => {
    const db = await dbPromise;
    await db.put("uploads", upload);
};

export const removeUpload = async (id) => {
    const db = await dbPromise;
    await db.delete("uploads", id);
};
