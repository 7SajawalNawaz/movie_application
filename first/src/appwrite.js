const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const SET_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;

import { Client, Databases, ID, Query } from "appwrite";

const client = new Client().setEndpoint(SET_ENDPOINT).setProject(PROJECT_ID);

const databases = new Databases(client);

export const updateSearchId = async (searchTerm, movie) => {
  //   use SDK to check if document with specific ID exists
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    // if it exists, update the count

    if (result.documents.length > 0) {
      const doc = result.documents[0];

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    }

    // if it doesn't exist, create a new document with the ID and count set to 1
    else {
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        postURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// getSearchMetrics --- IGNORE ---

export const getSearchTrending = async () => {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.documents;
  } catch (err) {
    console.error(err);
  }
};
