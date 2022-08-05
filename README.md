# zuri_node_authentication

# Contains node backend code to register for the application as well as provide for role based authentication.

# this repository contains code for the backend of an application, titled the "comrade", a comrade is a person who is part of a larger group of persons agitating for a better course,

on registering in the frontend, the application sends the comrade data to the backend which is powered by node, if the comrade already exist in the database it will throw an error, but if it doesn't it will register the comrade, upon registering the comrade he/she will have one of the following roles, "USER", "STAFF", "ADMIN", "MANAGER", "NOT ASSIGNED".

to register send the following data to the backend: name: String, email: String, password:String (at least 6 characters, must contain 1 uppercase, 1 special character, 1 number), roles: String (must be one of these "USER", "STAFF", "ADMIN", "MANAGER", "NOT ASSIGNED")
# here are the routes.
Register: http://localhost:8080/register
![image of registeration route](https://github.com/Davidalimazo/zuri_node_authentication/blob/main/register.png?raw=true)
![image of registeration route](https://github.com/Davidalimazo/zuri_node_authentication/blob/main/reg-admin.png?raw=true)

login: http://localhost:8080/login
send email:String, password: String
![image of login route](https://github.com/Davidalimazo/zuri_node_authentication/blob/main/login.png?raw=true)

Register: http://localhost:8080/password-recovery
send in your email:String
![image of password-recovery route](https://github.com/Davidalimazo/zuri_node_authentication/blob/main/pass-recovery.png?raw=true)

Authentication: 
![image of when a user visit route that he or she is not allowed](https://github.com/Davidalimazo/zuri_node_authentication/blob/main/unauthorize.png?raw=true)



