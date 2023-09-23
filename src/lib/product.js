import { db } from "../../Firebase/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where, updateDoc, limit, startAfter, orderBy, FieldPath
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// Add New Product
const addProduct = async (data) => {
  console.log("data", data);
  const snapshot = collection(db, "Products");
  // let q = query(snapshot, where("email", "==", data.email));
  // const ProductExist = await getDocs(q);

  // if (ProductExist.docs.length > 0) {
  //   return {
  //     message: "Product already exist!",
  //     code: 0,
  //   };
  // } else {
  const ref = doc(db, "Products", uuidv4());
  await setDoc(ref, data, { merge: true });
  const getRef = doc(db, "Products", ref.id);
  const res = await getDoc(getRef);
  return res.data()
    ? {
      data: { ...res.data(), id: res.id },
      message: "Product added successfully!",
      code: 1,
    }
    : {
      message: "Something went wrong!",
      code: 0,
    };
  // }
  // return ProductExist
};

// Get Single Product By Id
// const getProduct = async (id) => {
// };

// Get CategoryWise Products
const getCategoryWiseProducts = async (filters, page) => {
  const ref = collection(db, "Products");
  console.log("FILTERS", filters);
  console.log("PAGE NUMBER", page)

  let res;
  const pageSize = 12; // Number of products per page

  // Initialize the query without any filters
  let q = ref;

  if (filters) {
    // Add category filter if provided
    if (filters.category !== '') {
      q = query(q, where("category", "==", filters.category));
    }

    // Add country filter if provided
    if (filters.country !== '') {
      q = query(q, where("country", "==", filters.country));
    }
    if (filters.size !== '') {
      q = query(q, where("size", "==", filters.size));
    }

    // Add color filter if provided
    if (filters.color !== '') {
      q = query(q, where("color", "==", filters.color));
    }

    // Add minPrice and maxPrice filters if provided
    if (filters.minPrice !== '0') {
      q = query(q, where("price", ">=", filters.minPrice));
    }

    if (filters.maxPrice !== '0') {
      q = query(q, where("price", "<=", filters.maxPrice));
    }
  }

  // Determine the start point based on the page number
  if (page > 1) {
    const lastVisibleDoc = await getLastVisibleDoc(filters, page - 1);
    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }
  }

  // Limit the query to the page size
  q = query(q, limit(pageSize));

  // Execute the query with filters and pagination
  res = await getDocs(q);

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

const getCategoryWiseProductsById = async (filters, page, productIds) => {
  const ref = collection(db, "Products");
  console.log("FILTERS", filters);
  console.log("PAGE NUMBER", page);
  console.log("api ids", productIds);

  let res;
  const pageSize = 24; // Number of products per page

  // Initialize the query without any filters
  let q = ref;

  if (filters) {
    // Add category filter if provided
    if (filters.category !== '') {
      q = query(q, where("category", "==", filters.category));
    }

    // Add country filter if provided
    if (filters.country !== '') {
      q = query(q, where("country", "==", filters.country));
    }
    if (filters.size !== '') {
      q = query(q, where("size", "==", filters.size));
    }
    // Add color filter if provided
    if (filters.color !== '') {
      q = query(q, where("color", "==", filters.color));
    }

    // Add minPrice and maxPrice filters if provided
    if (filters.minPrice !== '0') {
      q = query(q, where("price", ">=", filters.minPrice));
    }

    if (filters.maxPrice !== '0') {
      q = query(q, where("price", "<=", filters.maxPrice));
    }
  }

  // Determine the start point based on the page number
  if (page > 1) {
    const lastVisibleDoc = await getLastVisibleDoc(filters, page - 1);
    if (lastVisibleDoc) {
      q = query(q, startAfter(lastVisibleDoc));
    }
  }

  // Limit the query to the page size
  q = query(q, limit(pageSize));

  // Execute the query with filters and pagination
  res = await getDocs(q);

  let docs = [];
  if (res.docs.length <= 0) {
    return [];
  } else {
    res.forEach((doc) => {
      if (productIds.includes(doc.id)) { // Only push products with matching doc.id
        docs.push({
          ...doc.data(),
          id: doc.id,
          createdAt: doc?.data()?.createdAt?.toDate()?.toString(),
        });
      }
    });
    console.log("DOCS", docs);

    return docs;
  }
};



// Custom filter function to filter documents by IDs
function filterByIds(ids) {
  return (doc) => ids.includes(doc.data().id); // Replace "id" with the actual field name representing the product ID
}






// Helper function to get the last visible document for pagination
const getLastVisibleDoc = async (filters, page) => {
  const pageSize = 40; // Number of products per page
  const ref = collection(db, "Products");

  let q = ref;

  if (filters) {
    // Apply filters if provided
    // ...

    // Adjust the start point for pagination
    if (page > 1) {
      q = query(q, limit(pageSize * page));
    } else {
      q = query(q, limit(pageSize));
    }

    const snapshot = await getDocs(q);

    if (snapshot.docs.length > 0) {
      return snapshot.docs[snapshot.docs.length - 1];
    }
  }

  return null;
};


// Get All Products
const getProducts = async (status) => {
  const ref = collection(db, "Products");
  console.log("status", status);

  let res;
  if (status !== null) {
    // Use the 'where' method to filter documents based on the status field
    const q = query(ref, where("status", "==", status));
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

// get popular

const getPopularProducts = async () => {
  const ref = collection(db, "Products");


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

const getFeaturedProducts = async () => {
  const ref = collection(db, "Products");

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


// Get Single Product
const getProductById = async (productId) => {
  console.log("API ID", productId);
  const ref = doc(db, "Products", productId);

  try {
    const docSnap = await getDoc(ref);

    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log("API data", data);

      // Use optional chaining to handle possible null or undefined values
      return {
        ...data,
        id: docSnap.id,
        createdAt: data?.createdAt?.toDate()?.toString(),
      };
    } else {
      // Handle the case where the product with the given ID does not exist.
      return null;
    }
  } catch (error) {
    // Handle any errors that may occur during the retrieval.
    console.error("Error getting product by ID:", error);
    throw error;
  }
};



// Update Product
const updateProduct = async (id, Product) => {
  console.log("Product in api", Product);
  console.log("ID in api", id);
  const ref = doc(db, "Products", id);
  await setDoc(ref, Product, { merge: true });
  return {
    ...Product,
    id,
  };
};

// Delete Product
const deleteProduct = async (id) => {
  console.log("DELETED", id)
  const ref = doc(db, "Products", id);
  await deleteDoc(ref);
  console.log("DELETED")
  return id;
};

// Update Product Status
const activateProduct = async (Product) => {
  const data = {
    id: Product.key,
    name: Product.name,
    isEnabled: true,
  };
  const ref = doc(db, "Products", Product.key);
  await setDoc(ref, data, { merge: true });
  return data;
};
// Update Product Status
const deActivateProduct = async (Product) => {
  const data = {
    id: Product.key,
    name: Product.name,
    isEnabled: false,
  };
  const ref = doc(db, "Products", data.id);
  await setDoc(ref, data, { merge: true });
  return data;
};




// Update Cart
const updateHeart = async (id) => {
  const ref = doc(db, "Products", id);

  // Get the current document data
  const docSnapshot = await getDoc(ref);
  const currentData = docSnapshot.data();

  // Toggle the heartField value

  const updatedHeartField = !currentData?.isHeartFilled;
  console.log("UPDATED value", updatedHeartField)


  // Create the update data object
  const updateData = {
    isHeartFilled: updatedHeartField
  };

  await updateDoc(ref, updateData);

  return {
    id,
    ...updateData
  };
};




// Get All Products
const getProductsBySeller = async (status, sellerID) => {
  const ref = collection(db, "Products");
  console.log("status", status);
  console.log("sellerID", sellerID);

  let res;
  if (status !== null) {
    // Use the 'where' method to filter documents based on the status field
    const q = query(ref, where("status", "==", status), where("sellerId", "==", sellerID));
    res = await getDocs(q);
  } else {
    const q = query(ref, where("sellerId", "==", sellerID));

    res = await getDocs(q);
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


const getAllProducts = async (sellerID) => {
  const ref = collection(db, "Products");

  const q = query(ref, where("sellerId", "==", sellerID));

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

const ProductApi = {
  addProduct,
  getProducts,
  updateProduct,
  activateProduct,
  deActivateProduct,
  deleteProduct,
  getProductById,
  getPopularProducts,
  getFeaturedProducts,
  getCategoryWiseProducts,
  getCategoryWiseProductsById,
  updateHeart,
  getProductsBySeller,
  getAllProducts
};

export default ProductApi;
