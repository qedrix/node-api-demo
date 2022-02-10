# node-api-demo

This is a node RESTful api service demonstrating the features of Typescript, Express frameworks and validation.

I have used [Prisma](https://www.prisma.io/) for the ORM layer. 
In the future I may migrate to [TypeORM](https://typeorm.io/). 

### Features

This api exposes the following functions - 

1. User Registration
2. User Account Activation
3. Password Reset Function
4. User Shopping Preferences can be created, modified and displayed
5. User Information retrival
   

### Run App

Clone the repository in your local file system.

```
$ git clone https://github.com/qedrix/node-api-demo.git
```

To run this app, you will require [Docker](https://docs.docker.com/engine/install/) pre-installed on your system.

Execute the following commands in sequence -

1. Change to the project directory

```
$ cd node-api-demo
```

2. Build the docker image 

```
$ docker build -t qedrix/node-api-demo .
```

3. Run the docker image

```
$ docker run -p 5000:5000 qedrix/node-api-dem
```

Once the app starts, you may use the Postman collection to test the various api functions.

[^1] We use Sqlite DB for ease of setup and can easily be replaced with a PostgresSQL DB / Maria DB.
[^2] Make sure the port 5000 is not already bound by a process


### Swagger-UI

To access the swagger ui go to -  http://localhost:5000/api-docs 
