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

const createOneUser = async (user) => {
    try {
        await client.connect();
        let result = await userCollection.insertOne(user);
        console.log(`New listing created with the following id: ${result.insertedId}`);
        return user;
    } catch (e) {
        console.error(e);
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getAllUsers = async () => {
    try {
        await client.connect();
        const cursor = userCollection.find();
        const results = await cursor.toArray(); // convert the cursor to an array
        const lenghtOfResults = results.length;
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
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

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
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getUserById = async (userId) => {
    try {
        await client.connect();
        const result = await userCollection.findOne({
            _id: new ObjectId(userId),
        });
        console.log(`Found a listing for user with ID ${userId}`);
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
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const createOneExercise = async (userId, newExercise) => {
    try {
        const user = await userCollection.findOne({ _id: new ObjectId(userId) });
        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        newExercise.userId = new ObjectId(userId); // add userId to newExercise object
        const result = await exerciseCollection.insertOne(newExercise); // insert newExercise into collection
        console.log(`New exercise created with the following id: ${result.insertedId}`);

        // create response object
        const response = {
            _id: user._id,
            username: user.username,
            description: result.description,
            date: new Date(result.date).toDateString(),
        };
        console.log(`Response object: ${response}`);
        return response;
    } catch (e) {
        console.error(`Failed to create exercise. ${e}`);
        throw e;
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

const getExercisesByUserId = async (userId) => {
    try {
        await client.connect();
        const result = await exerciseCollection.find({ userId: new ObjectId(userId) }).toArray();
        console.log(`Found ${result.length} exercises for user with ID ${userId}`);
        if (result.length > 0) {
            console.log(result);
        } else {
            console.log(`No exercises found for user with ID ${userId}`);
        }
        return result;
    } catch (e) {
        console.error(`Failed to get exercises. ${e}`);
        throw e;
    }
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

module.exports = {
    createOneUser,
    getUserByName,
    getAllUsers,
    getUserById,
    createOneExercise,
    getExercisesByUserId,
};
