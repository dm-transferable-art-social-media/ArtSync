import { getFirestore, collection, getDoc, getDocs, addDoc, doc, setDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
//firebaseConfig.js holds info to tell you which firebase project to communicate with
import firebaseConfig from './firebaseConfig'; 

const app = initializeApp(firebaseConfig); //we do this as well for authentication (in Login.js)
const db = getFirestore(app); //get the firestore database that belongs to the web app

const dbHandler = ({ collectionName }) => {
    //compare this to the line down below: const docRef = doc(db, collectionName, docID);
    //one is getting a collection, one is getting a document from a collection
    const dataCollection = collection(db, collectionName); 

    /* Get all data within collection */
    //with async, it means: wait for event, and go with the next line of code
    const getAllData = async () => {
        try {
            //it takes some time to read from database
            //it's forcing the code to wait here before moving on to its next line of code.
            //normally this would be what we imagine a line of code to always do,
            //but because here it is communicating with another computer (ie the server)
            //  the default would be for it to go on to the next line of code
            //We don't fully understand this.  This might be wrong.
            const querySnapshot = await getDocs(dataCollection); 
    
            if (!querySnapshot || !querySnapshot.docs) {
                console.error("No documents found in the query snapshot.");
                return [];
            }
            // Use map to create an array of promises
            // map is a javascript iteravie function.  It will return the data for each item in the document.
            // Not sure why it's asycn.  Maybe so that it can collect data in parallel?
            // We're filling in the indices in an array in parallel
            const dataPromises = querySnapshot.docs.map(async (doc) => {
                return doc.data();
            });
    
            // Use Promise.all to wait for all promises to resolve
            // We want to make sure all of these promises are done before we return.
            return await Promise.all(dataPromises);
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
                console.log(`${documentSnapshot.id} => ${JSON.stringify(documentSnapshot.data())}`);
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
    const addData = async (docID, data, mergeVal = true) => {
        try {
            const userDocRef = doc(dataCollection, docID);
            await setDoc(userDocRef, data, {merge: mergeVal});
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    };

    return {
        getDataByDocID,
        getAllData,
        addData
      };
}

export default dbHandler;