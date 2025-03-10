import { db } from "../../utils/firebase.js"

export const getUsers = async () => {
    try {
        const userRef = db.collection('users')
        const userSnapshot = await userRef.get()
        if (userSnapshot.empty) {
            console.log('No users found in the database');
            return [];
        }

        const users = [];
        userSnapshot.forEach(doc => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return users;
    } catch (error) {
        console.error("Error getting data ", error)
        throw error
    }
}