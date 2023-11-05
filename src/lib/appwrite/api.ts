import { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw new Error("Account creation failed");

    const avatarUrl = avatars.getInitials(user.name);

    // Run function that saves user to database
    const newUser = await saveUserToDb({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;

    return newAccount;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDb(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return user;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function signInAccount(user: {email: string, password: string}) {
    try {
        const session = await account.createEmailSession(user.email, user.password);
        return session;
    } catch (error) {
        console.error(error);
        return error;
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw new Error('No user found');
        
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [
                Query.equal('accountId', currentAccount.$id) 
            ]
        );

        if(!currentUser) throw new Error('No user found');

        return currentUser.documents[0] ;
    } catch (error) {
        console.error(error);
        return error;
    }
}