const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const uri = `${process.env.MONGO_DB_CONNECTION_STRING}`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

const dbname = "test";
const collection_user = "users";
const collection_exercise = "exercises";
const userCollection = client.db(dbname).collection(collection_user);
const exerciseCollection = client.db(dbname).collection(collection_exercise);

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Create a user
const createOneUser = async (user) => {
    try {
        await client.connect();
        let result = await userCollection.insertOne(user);
        console.log(`New listing created with the following id: ${result.insertedId}`);
        return user;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Get all users
const getAllUsers = async () => {
    try {
        await client.connect();
        // cursor commonly used for larger datasets via GET /requests
        const cursor = userCollection.find();
        const results = await cursor.toArray(); // convert the cursor to an array
        if (results.length > 0) {
            console.log("Found the following records");
            console.log(results);
            return results;
        } else {
            console.log("No documents found!");
            return [];
        }
    } catch (e) {
        console.error(e);
        return [];
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Get user object by name
const getUserByName = async (name) => {
    try {
        await client.connect();
        const result = await userCollection.findOne({ username: name });
        if (result) {
            console.log(`Found a listing in the collection with the name '${name}':`);
            console.log(result);
            return result;
        } else {
            console.log(`No listings found with the name '${name}'`);
            return null;
        }
    } catch (e) {
        console.error(e);
        return [];
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Get user object by id
const getUserById = async (userId) => {
    try {
        await client.connect();
        const result = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (result) {
            console.log(`Found a listing in the collection with the id of '${userId}':`);
            console.log(result);
            return result;
        } else {
            console.log(`No listings found with the id '${userId}'`);
            return null;
        }
    } catch (e) {
        console.error(e);
        return [];
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Create an exercise
const createOneExercise = async (createExerciseObj) => {
    try {
        await client.connect();
        let result = await exerciseCollection.insertMany(createExerciseObj);
        return result;
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// Get an exercise by id
const getExerciseById = async (userId) => {
    try {
        await client.connect();
        const result = await exerciseCollection.findOne({ _id: userId });
        if (result) {
            console.log(`Found a listing in the collection with the id of '${userId}':`);
            console.log(result);
            return result;
        } else {
            console.log(`No listings found with the id '${userId}'`);
            return null;
        }
    } catch (e) {
        console.error(e);
        return [];
    } finally {
        await client.close();
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

module.exports = {
    createOneUser,
    getUserByName,
    getAllUsers,
    getUserById,
    createOneExercise,
    getExerciseById,
};
