const express = require("express");
const router = express.Router();
const { getUserById } = require("../database/indexDB");
const { getUserByName } = require("../database/indexDB");
const { getAllUsers } = require("../database/indexDB");
const { createOneUser } = require("../database/indexDB");
const { createOneExercise } = require("../database/indexDB");
const { getExercisesByUserId } = require("../database/indexDB");

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Create a new user
router.post("/api/users", async (req, res) => {
    const user = req.body;
    await createOneUser(user); // ->
    const userObj = {
        username: user.username,
        _id: user._id,
    };
    res.json(userObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// getAllUsers
router.get("/api/users", async (req, res) => {
    const result = await getAllUsers();
    res.json(result);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Get id by providing username
router.get("/api/users/:name/userbyname", async (req, res) => {
    const name = req.params.name;
    const result = await getUserByName(name);
    await getUserByName(name);

    const userObj = {
        _id: result._id,
        username: name,
    };
    res.json(userObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Get username by providing id
router.get("/api/users/:userId/userbyid", async (req, res) => {
    const userId = req.params.userId;
    const result = await getUserById(userId);

    const userObj = {
        _id: userId,
        username: result.username,
    };

    res.json(userObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Create an exercise
router.post("/api/users/:_id/exercises", async (req, res) => {
    const userId = req.params._id;
    const result = await getUserById(userId); // find user by id
    console.log(`Adding exercise for user with ID ${userId}`);
    const exercise = req.body;

    if (!exercise.description || !exercise.duration) {
        return res.status(400).send("Description and duration are required");
    }

    // if date is empty, set it to today's date
    if (exercise.date === "" || exercise.date === undefined) {
        exercise.date = new Date().toISOString();
    }
    // if date is not empty, convert it to a date object
    else {
        let dateObj = new Date(exercise.date);

        // check if date is valid
        if (isNaN(dateObj.getTime())) {
            return res.status(400).send("Invalid date");
        }

        // check if date is in the future
        if (dateObj > new Date()) {
            return res.status(400).send("Date cannot be in the future");
        }

        // set date to formatted string in UTC time zone
        exercise.date = dateObj.toISOString();
    }

    const newExercise = {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
    };

    await createOneExercise(userId, newExercise); // create exercise

    const userExercises = await getExercisesByUserId(userId);

    const userObj = {
        username: result.username,
        _id: userId,
    };

    const exercises = userExercises.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
    }));

    const responseObj = {
        username: userObj.username,
        _id: userObj._id,
        count: exercises.length,
        log: exercises,
    };

    return res.json(responseObj);
    // res.json(responseObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Get an exercise log
router.get("/api/users/:_id/logs", async (req, res) => {
    const userId = req.params._id;
    const user = await getUserById(userId); // get username ->
    console.log(`Retrieving exercise logs for user with ID ${userId}`);

    // (*) Get all exercises by user id
    let userExercises = await getExercisesByUserId(userId);

    const userObj = {
        username: user.username, // username returned from db via getUserById
        _id: userId, // id -> `:_id`
    };

    // Get the optional query parameters
    const { from, to, limit } = req.query;

    //
    let fromDate = new Date(0);
    let toDate = new Date();
    let maxLogs = userExercises.length;

    if (from) {
        fromDate = new Date(from);
    }

    if (to) {
        toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999); // set the time to the end of the day
    }

    if (limit) {
        maxLogs = parseInt(limit);
    }

    fromDate.setHours(0, 0, 0, 0); // set the time to the beginning of the day

    userExercises = userExercises
        .filter((exercise) => {
            const exerciseDate = new Date(exercise.date);
            return exerciseDate >= fromDate && exerciseDate <= toDate;
        })
        .slice(0, maxLogs);

    toDate.setHours(23, 59, 59, 999);

    const exercises = userExercises.map((exercise) => ({
        description: exercise.description,
        duration: parseInt(exercise.duration),
        date: exercise.date,
    }));

    const responseObj = {
        username: userObj.username,
        _id: userObj._id,
        count: exercises.length,
        log: exercises,
    };

    res.json(responseObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

module.exports = router;
