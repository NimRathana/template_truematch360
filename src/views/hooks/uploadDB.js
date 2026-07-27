import {openDB} from 'idb';

export const dbPromise = openDB("chat-upload-db", 1, {
    upgrade(db){
        if (!db.objectStoreNames.contains("uploads")){
            db.createObjectStore("uploads",{
                keyPath: "id"
            })
        }
    }
})
