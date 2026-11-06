# Student Course Registration Backend

Node.js + Express + MongoDB (Mongoose) REST API.

## Setup

1. Install Node.js and MongoDB (or use a MongoDB Atlas URI).
2. In this folder run:
   ```
   npm install
   ```
3. Check `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/student_registration
   ```
4. Start the server:
   ```
   npm start
   ```

## Student model

| Field      | Type   | Rules                               |
|------------|--------|-------------------------------------|
| name       | String | required, 2-100 chars               |
| email      | String | required, valid format, **unique**  |
| department | String | required                            |
| course     | String | required                            |

## Endpoints

| Method | Endpoint                          | Operation              | Success |
|--------|-----------------------------------|------------------------|---------|
| POST   | /api/students                     | Add student            | 201     |
| GET    | /api/students                     | Retrieve all students  | 200     |
| GET    | /api/students/:id                 | Retrieve student by ID | 200     |
| PUT    | /api/students/:id                 | Update student         | 200     |
| DELETE | /api/students/:id                 | Delete student         | 200     |
| GET    | /api/students?department=IT       | Filter by department   | 200     |

## Error codes

- 400 – validation failed, invalid ID, or malformed JSON
- 404 – student / route not found
- 409 – duplicate email
- 500 – unexpected server error

## Testing in Postman

1. Postman → Import → select `Student_Registration.postman_collection.json`.
2. Run requests in order 1 → 10. Request 1 saves the new student's `_id` into the `studentId` variable, which requests 6, 9 and 10 use automatically.
3. Take screenshots of each response (status code visible) for submission.
