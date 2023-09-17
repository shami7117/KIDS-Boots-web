import { db } from "../../Firebase/firebase";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    addDoc, updateDoc
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Add New Cart
const addCart = async (data) => {
    console.log("API data", data);
    const snapshot = collection(db, "Carts");
    let q = query(snapshot, where("id", "==", data.id));
    const CartExist = await getDocs(q);

    if (CartExist.docs.length > 0) {
        return {
            message: "Cart already exist!",
            code: 0,
        };
    } else {
        const ref = doc(db, "Carts", uuidv4());
        const dataToSet = {
            ...data,
            createdAt: new Date(), // Replace undefined with a valid timestamp or other appropriate value
        };


        // Use addDoc to add a new document to the collection
        const newDocRef = await addDoc(collection(db, "Carts"), dataToSet);

        // Retrieve the newly added document to get its data and ID
        const res = await getDoc(newDocRef);
        return res.data()
            ? {
                data: { ...res.data(), id: res.id },
                message: "Cart added successfully!",
                code: 1,
            }
            : {
                message: "Something went wrong!",
                code: 0,
            };
    }

    return CartExist
};




// Get Single Cart By Id
// const getCart = async (id) => {
// };

// Get CategoryWise Carts
const getCategoryWiseCarts = async (Category) => {
    const ref = collection(db, "Carts");
    console.log("Category", Category);

    let res;
    if (Category !== null) {
        // Use the 'where' method to filter documents based on the status field
        const q = query(ref, where("category", "==", Category));
        res = await getDocs(q);
    } else {
        res = await getDocs(ref);
    }

    let docs = [];

    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            docs.push({
                ...doc.data(),
                id: doc.id,
                createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
            });
        });
        return docs;
    }
};
// Get All Carts
const getCarts = async () => {
    const ref = collection(db, "Carts");

    let res;

    res = await getDocs(ref);


    let docs = [];

    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            docs.push({
                ...doc.data(),
                // id: doc.id,
                createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
            });
        });
        return docs;
    }
};

// get popular

const getPopularCarts = async () => {
    const ref = collection(db, "Carts");


    // Use the 'where' method to filter documents based on the queryField and queryValue
    const q = query(ref, where("popular", "==", "True"));
    const res = await getDocs(q);


    let docs = [];

    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            docs.push({
                ...doc.data(),
                id: doc.id,
                createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
            });
        });


        return docs;
    }
};


// get Featured

const getFeaturedCarts = async () => {
    const ref = collection(db, "Carts");

    // Use the 'where' method to filter documents based on the queryField and queryValue
    const q = query(ref, where("featured", "==", "True"));
    const res = await getDocs(q);



    let docs = [];

    if (res.docs.length <= 0) {
        return [];
    } else {
        res.forEach((doc) => {
            docs.push({
                ...doc.data(),
                id: doc.id,
                createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
            });
        });

        return docs;
    }
};


// Get Single Cart
const getCartById = async (CartId) => {
    const ref = doc(db, "Carts", CartId);

    try {
        const docSnap = await getDoc(ref);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...data,
                id: docSnap.id,
                createdAt: data?.createdAt?.toDate()?.toString(),
            };
        } else {
            // Handle the case where the Cart with the given ID does not exist.
            return null;
        }
    } catch (error) {
        // Handle any errors that may occur during the retrieval.
        console.error("Error getting Cart by ID:", error);
        throw error;
    }
};





// Delete Cart
const deleteCart = async (id) => {
    try {
        // Get a reference to the document with the specified id
        const q = query(collection(db, 'Carts'), where('id', '==', id));
        const querySnapshot = await getDocs(q);

        // Check if the document exists
        if (querySnapshot.size === 0) {
            console.error(`Document with id ${id} not found.`);
            return null; // or throw an error if appropriate
        }

        // Delete the document
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        console.log(`Document with id ${id} has been deleted.`);
        return id;
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};

// Update Cart Status
const activateCart = async (Cart) => {
    const data = {
        id: Cart.key,
        name: Cart.name,
        isEnabled: true,
    };
    const ref = doc(db, "Carts", Cart.key);
    await setDoc(ref, data, { merge: true });
    return data;
};
// Update Cart Status
const deActivateCart = async (Cart) => {
    const data = {
        id: Cart.key,
        name: Cart.name,
        isEnabled: false,
    };
    const ref = doc(db, "Carts", data.id);
    await setDoc(ref, data, { merge: true });
    return data;
};

// Update Cart
const updateHeart = async (id) => {
    const q = query(collection(db, 'Carts'), where('id', '==', id));
    const querySnapshot = await getDocs(q);

    // Check if a matching document exists
    if (querySnapshot.empty) {
        throw new Error(`Document with ID ${id} not found`);
    }

    // Get the reference to the first matching document
    const docRef = querySnapshot.docs[0].ref;

    // Get the current document data
    const docSnapshot = await getDoc(docRef);
    const currentData = docSnapshot.data();

    // Toggle the heartField value
    const updatedHeartField = !currentData?.isHeartFilled;
    console.log("UPDATED value", updatedHeartField)

    // Create the update data object
    const updateData = {
        isHeartFilled: updatedHeartField
    };

    await updateDoc(docRef, updateData);

    return {
        id,
        ...updateData
    };
};


const CartApi = {
    addCart,
    getCarts,
    updateHeart,
    activateCart,
    deActivateCart,
    deleteCart,
    getCartById,
    getPopularCarts,
    getFeaturedCarts,
    getCategoryWiseCarts,

};

export default CartApi;
