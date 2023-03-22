## Exercise Tracker Application

### What it does

A full stack Node.js, Express and MongoDB app that allows users to create
new users, add exercises to their log, and view their exercise log.

### API Reference

| Endpoint                    | Method | Description               | Parameters                        |
| --------------------------- | ------ | ------------------------- | --------------------------------- |
| `/api/users`                | POST   | Create a new user         | `username`                        |
| `/api/users/:_id/exercises` | POST   | Add an exercise to a user | `description`, `duration`, `date` |
| `/api/users/:_id/logs`      | GET    | Get a user's exercise log | `from`, `to`, `limit`             |
| `/api/users`                | GET    | Get a list of all users   | None                              |



### Example Usage

1. Create a new user by sending a POST request to `/api/users` with a `username`
   parameter. The response will be an object with the new user's `username` and
   `_id`.

2. Add exercises to a user by sending a POST request to
   `/api/users/:_id/exercises` with the following parameters:

    - `description` (required)
    - `duration` (required)
    - `date` (optional)

    The response will be the user object with the exercise fields added.

3. View a user's exercise log by sending a GET request to  
   `/api/users/:_id/logs` with the following parameters:

    - `from` (optional)
    - `to` (optional)
    - `limit` (optional)

    The response will be the user object with a `log` array of all the exercises
    added. Each log item has the `description`, `duration`, and `date` properties.

4. You can view a full list of all users by sending a GET request to
   `/api/users`.


### Installation

1. Clone the repo `git clone ${repo_url}}`

2. Install dependencies `npm install`

3. Start the server `npm start`

4. Visit `http://localhost:3000` in your browser

Note: You will need to run MongoDB locally or have a MongoDB Atlas account and a MongoDB database.
You will also need to create a `.env` file in the root directory of the project and add the following line:

MONGO_DB_CONNECTION_STRING=`mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`