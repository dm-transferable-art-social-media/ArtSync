import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  addDoc,
  doc,
  setDoc,
  where,
  query,
} from "firebase/firestore";
import { initializeApp } from "firebase/app";
//firebaseConfig.js holds info to tell you which firebase project to communicate with
import firebaseConfig from "./firebaseConfig";

const app = initializeApp(firebaseConfig); //we do this as well for authentication (in Login.js)
const db = getFirestore(app); //get the firestore database that belongs to the web app

const dbHandler = ({ collectionName }) => {
  //compare this to the line down below: const docRef = doc(db, collectionName, docID);
  //one is getting a collection, one is getting a document from a collection
  const dataCollection = collection(db, collectionName);

  /* Get all data within collection */
  //with async, it means: wait for event, and go with the next line of code
  const getAllData = async (userHandle) => {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, collectionName),
          where("userHandle", "==", userHandle)
        )
      );

      if (!querySnapshot || !querySnapshot.docs) {
        console.error("No documents found in the query snapshot.");
        return [];
      }

      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return [];
    }
  };

  /* Get data from specific document within the collection */
  const getDataByDocID = async (docID) => {
    try {
      const docRef = doc(db, collectionName, docID);
      const documentSnapshot = await getDoc(docRef);

      if (documentSnapshot.exists()) {
        console.log(
          `${documentSnapshot.id} => ${JSON.stringify(documentSnapshot.data())}`
        );
        return documentSnapshot.data();
      } else {
        console.log(`Document with ID ${docID} not found`);
      }
    } catch (error) {
      console.error("Error getting document by ID: ", error);
    }
  };

  /* Write data into document ID of docID. If it exists, the data will be merged into the existing ID */
  //inputs
  //  parameters
  //    docID: specific doc ID (this will be users for this example)
  //      if docID does not exist in the "dataCollection", then it will get created
  //    data: the data you want to pass in, as json format
  //      should have at least one value:
  //      json format: {
  //                      field : value,
  //                      field : value,
  //                      ...
  //                   }
  //      a value could be a nother json, so we can have a nested situation
  //      ie for fitbit
  //    mergeVal: default true, means that it will replace an existing field if already there
  //      (we think if set to false, it would go in at all, but this should be checked)
  const addData = async (userHandle, postData) => {
    try {
      await addDoc(dataCollection, { ...postData, userHandle });
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return {
    getDataByDocID,
    getAllData,
    addData,
  };
};

export default dbHandler;
