const express = require("express");
const router = express.Router();
const { getUserById } = require("../database/indexDB");
const { getUserByName } = require("../database/indexDB");
const { getAllUsers } = require("../database/indexDB");
const { createOneUser } = require("../database/indexDB");
const { createOneExercise } = require("../database/indexDB");
const { getExerciseById } = require("../database/indexDB");

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
    const userId = req.params._id; // grab id, query db for username
    const result = await getUserById(userId);

    const userObj = {
        username: result.username,
        _id: userId,
    };

    // description/duration/[date]
    const exercise = req.body;

    // if date is empty, set it to today's date
    if (exercise.date === "" || exercise.date === undefined) {
        exercise.date = new Date().toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    const exerciseObj = {
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date,
    };

    const createExerciseObj = [
        {
            username: userObj.username,
            description: exerciseObj.description,
            duration: exerciseObj.duration,
            date: exerciseObj.date,
            _id: userObj._id,
        },
    ];

    // fetch the exercise from the db [implicit return]
    await createOneExercise(createExerciseObj);

    // send the JSON response
    res.json(createExerciseObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Get exercise by id
router.get("/api/users/:_id/exercises/", async (req, res) => {
    const userId = req.params._id;
    const result = await getExerciseById(userId);

    const exerciseObj = [
        {
            description: result.description,
            duration: result.duration,
            date: result.date,
        },
    ];

    res.json(exerciseObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

// Get an exercise log
router.get("/api/users/:_id/logs", async (req, res) => {
    const userId = req.params._id;
    const user = await getUserById(userId); //  ->

    const userObj = {
        username: user.username,
        _id: userId,
    };

    // get exercise by id
    const result = await getExerciseById(userId); // ->
    const exerciseObj = [
        {
            description: result.description,
            duration: result.duration,
            date: result.date,
        },
    ];

    const logObj = {
        username: userObj.username,
        _id: userObj._id,
        count: exerciseObj.length,
        log: exerciseObj,
    };

    res.json(logObj);
});

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

module.exports = router;
