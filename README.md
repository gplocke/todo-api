This is a simple REST API that manages a list of Todo objects in a Mongodb collection.  It also provides user management functionality in order to associate todos with users.  Users are created by the `/auth/signup` endpoint.

Requirements
-
Node.js 9.0.0 or greater

**_Theory and Areas for Improvements_**

Each todo in the todo collection holds a reference to the id of the user that created it.  We could flip this so that a single user exists and has an array of todos in order to efficiently store the data and take advantage of the way Mongo stores documents.

However, I decided to store the user id along with the todo because that can allow for a future enhancement of lists of todos instead of a single collection of todos or a collaborative list of todos where multiple users are contributing to the same list.  It seemed like a good trade-off for being able to be flexible and prevent having to reengineer in the future.


**How to run the server**

Set the MongoDB connection parameters in your environment. The app pulls them from there so keep the secrets out of the repo. The database name is defaulted to `todo` but you can modify it to whatever you called your database when you created it if you need to.  It's in the `services.mongodb.options.database` parameter in the config file.

_If you're using Windows use `set` instead of `export`_
```
export TODO_MONGODB_HOST=your_mongo_host:port
export TODO_MONGODB_USERNAME=your_mongo_username
export TODO_MONGODB_PASSWORD=your_mongo_password
```

Then install the dependencies and run the server.

```
% npm install
% npm dev
```

To run the tests

```
% npm test
```

The server listens on `localhost:8080` by default using the `development` environment. The environment and port can be specified by the process environment.  The user and todo endpoints require an `Authorization` header to be set to a valid JWT returned from either the `auth/login` or `auth/signup` endpoints.

A JWT can be retrieved by sending a `POST` to either the `auth/login` endpoint or the `auth/signup` endpoint.

**Auth Endpoints**
-
Register a new user.  This method goes ahead and returns a JWT for the user so they don't have to login in a second request.
```
POST /auth/signup
```

Request body:
```
{
    firstName: String,
    lastName: String,
    email: String,
    password: String
}
```

---
Logs a user in and returns a JWT for them to use in an `Authorization` header for subsequent requests.
```
POST /auth/login
```

Request body:
```
{
    firstName: String,
    lastName: String,
    email: String,
    password: String
}
```


**Todo Endpoints**
-

Retrieve the entire list of todos in the database.

```
GET /todo
```

---

Create a new todo.
```
POST /todo
```

Request body:
```
{
    text: String
}
```

---

Retrieves a todo by its id

```
GET /todo/:id
```

---

Updates an existing todo by its id.

```
PUT /todo/:id
```
Request body:
```
{
    text: String
}
```

---

Deletes a todo from the database

```
DELETE /todo/:id
```

**User Endpoints**
-

Retrieve the entire list of users in the database.

```
GET /user
```

---

Create a new user.
```
POST /user
```

Request body:
```
{
    firstName: String,
    lastName: String,
    email: String,
    password: String
}
```
---
Retrieves the user info of the currently logged in user

```
GET /user/me
```

---

Retrieves a user by id

```
GET /user/:id
```

---

Updates an existing user by their id.

```
PUT /user/:id
```
Request body:
```
{
    text: String
}
```

---

Deletes a user from the database and removes all the todos associated with their user account.

```
DELETE /user/:id
```