This is a simple REST API that manages a list of Todo objects in a Mongodb collection.  It also provides user management functionality in order to associate todos with users.  Users are created by the `/auth/signup` endpoint and then each todo that is created is associated with that user, so they only have access to their own todos.

Requirements
-
Node.js 9.0.0 or greater

**_Design Theory_**

Each todo in the todo collection holds a reference to the id of the user that created it.  We could flip this so that a single user exists and has an array of todos in order to efficiently store the data and take advantage of the way Mongo stores documents.

However, I decided to store the user id along with the todo because that can allow for a future enhancement of lists of todos instead of a single collection of todos or a collaborative list of todos where multiple users are contributing to the same list.  It seemed like a good trade-off for being able to be flexible and prevent having to reengineer in the future.

**_Areas for Improvements_**

- Add better validation and filtering of parameters in some middleware
- Add more tests for more comprehensive situations
- Add tests for User management endpoints (the user controller is in there as just a POC for the moment and isn't really used other than the `/user/me` endpoint)
- Use an in-memory MongoDB so that there's no need for an external test database.
- Better handling of invalid JSON input

**Setup**
-

Set the MongoDB connection parameters in your environment. The app pulls them from there so keep the secrets out of the repo. The database name is defaulted to `todo` but you can modify it to whatever you called your database when you created it if you need to.  It's in the `services.mongodb.options.database` parameter in the config file.

_If you're using Windows use `set` instead of `export`_
```
export TODO_MONGODB_HOST=your_mongo_host:port
export TODO_MONGODB_USERNAME=your_mongo_username
export TODO_MONGODB_PASSWORD=your_mongo_password
```

Then install the dependencies and run the server:

```
% npm install
% npm dev
```

**Running Tests**
-
_**It's a good idea to use a different test different test database for tests as the database isn't mocked yet!**_

To run the tests run the following:

```
% npm test
```

**Usage**
-
The server listens on `localhost:8080` by default using the `development` environment. The environment and port can be specified by the process environment.  The user and todo endpoints require an `Authorization` header to be set to a valid JWT returned from either the `auth/login` or `auth/signup` endpoints.

A JWT can be retrieved by sending a `POST` to either the `auth/login` endpoint or the `auth/signup` endpoint.

**Sample Requests**

Get logged in user
```
curl -X GET \
  http://localhost:8080/user/me \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYzEwYmExNTQxNDhhMzE2MWQ4OGFlYSIsImlhdCI6MTUzOTM3OTYxMiwiZXhwIjoxNTM5NDY2MDEyfQ.Nx-y7Vcuzb6K684qqpWzhFzUoy4z-rQo08eFKTvdYcE' \
  -H 'content-type: application/json'
  ```

Create new todo
```
curl -X POST \
  http://localhost:8080/todo \
  -H 'authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYzI0OWU5NjQ2NjEyYmE5NGExMDgxYiIsImlhdCI6MTUzOTQ2MTkwNSwiZXhwIjoxNTM5NTQ4MzA1fQ.tj57lpxBKMupUpDJ78cypzSqrCwxeaIbkSs5bLApkhc' \
  -H 'content-type: application/json' \
  -d '{
"text": "Get groceries"
}'
```

*Auth Endpoints*
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

Response body:
```
{
    "message": "Login successful.",
    "response": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViYzI0OWU5NjQ2NjEyYmE5NGExMDgxYiIsImlhdCI6MTUzOTQ2MTUzMiwiZXhwIjoxNTM5NTQ3OTMyfQ.dco9gRpBP8_68y3-JMMSsR-FC4BmpXRritsqTXMqlKU"
    }
}
```


*Todo Endpoints*
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
    text: String,
    complete: Bool
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
    text: String,
    complete: Bool
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
    fistName: String,
    lastName: String,
    email: String,
    password: String
}
```

---

Deletes a user from the database and removes all the todos associated with their user account.

```
DELETE /user/:id
```