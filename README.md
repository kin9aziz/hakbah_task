![Image of Hakbah](https://hakbah.sa/wp-content/uploads/2021/04/hakbah-ar-logo-3.png)

# BACKEND TASK USING BASIC CRUD:
* Signup new USER (POST)
* Create a Login API (POST)
* Get User Profile (GET)
* Change Password (PUT)


## POSTMAN:
*  http://YOUR-IP-ADDRESS:3003/api/user/login [POST]:
```json
{
    "username": 'kin9aziz',
    "password": "noway123"
}
```
*  http://YOUR-IP-ADDRESS:3003/api/user/signUp [POST] 
```json
{
    "username": 'kin9aziz',
    "password": "noway123",
    "name": "Abdulaziz Alqahtani"
}
```

* http://YOUR-IP-ADDRESS:3003/api/user/getUserProfile [GET] HEADER {authorization: token}
* http://YOUR-IP-ADDRESS:3003/api/user/changePassword [PUT] HEADER {authorization: token}:
 ```json
 {
     "oldPassword": 'noway123',
     "newPassword": "test@123"
 }
 ```

## Run Server:
* using pm2: `pm2 start process.json`
* using node: `node server.js`
* using nodemon: `npm start`

## Turn On or Off Cluster:
Go To `server.js` File and change function `setupServer(true)`.
* True mean Cluster is ON.
* False mean Cluster is OFF


## Developed By
* Abdulaziz Alqahtani
