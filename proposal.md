# Apollo

Created by Raffy and Jordi.

## 🚀 Mission statement

Our application, Apollo is for music enthusiasts who love to tweak their favorite songs. It allows users to adjust the speed and pitch of songs as well as share their unique mixes with the world.

## API & React Router

This application will use the API. Below are the documentation and specific endpoints we intend to use and the front-end pages that will use them.

API - The Null Pointer [https://0x0.st/]

1. Upload API - [POST] https://0x0.st/

- This endpoint allows users to upload any data to the hosting service.
- { file: data to host, secret: (ignored/nullable), expires: sets expiration time on hosted data }

2. Manage API - [POST] https://0x0.st/{fileIdentifier}

- This endpoint allows for managing hosted data (delete or update expiration).
- { token: access token to authorize deletes, delete: (ignored/nullable), expires: sets expiration time on hosted data }

3. Single Fetch API - [GET] https://0x0.st/{fileIdentifier}

- This endpoint allows for accessing data saved on the hosting service.
- NONE

## 👩‍💻 MVP User Stories & Frontend Routes

The application will feature the following frontend routes and core features:

- On the `/` page, users will be a landing page which handles redirections on whether the user is logged in or ont
- On the `/home` page, users will be able to view/import/export their projects
- The `/mixer/:id` endpoint serves as an audio editor, allowing users to adjust the pitch and speed of the audio within their workspace.
- On the `/profile` page, users can view and edit their profile
- On the `/auth` page, users can login/signup for an Apollo account

## 🤔 Stretch User Stories

If time permits, the following stretch features will be implemented in order of priority:

- Users will be able to move from local storage to a remote database
- Users will be able to get steams from a track and modify the levels
- Users will be able to record audio straight from the browser and import it straight to Apollo

## 📆 Timeline for reaching MVP in 1 week

To ensure that we can complete all core features of the application in 1 week, we will aim to complete tasks according to the following timeline:

**Day 1**

- [ ] Ticket description and due date
- [ ] Ticket description and due date
- [ ] Ticket description and due date

**Day 2**

- [ ] Ticket description and due date
- [ ] Ticket description and due date
- [ ] Ticket description and due date

**Day 3** (MVP due by the end of the day)

- [ ] Ticket description and due date
- [ ] Ticket description and due date
- [ ] Ticket description and due date

**Day 4**

- [ ] Ticket description and due date
- [ ] Ticket description and due date
- [ ] Ticket description and due date

**Day 5**

- [ ] Ticket description and due date
- [ ] Ticket description and due date
- [ ] Ticket description and due date

## Wireframes of each page in your application

Below, you can find wireframes for our project. Each wireframe shows a different page of our application as well as the key components of the application. Details such as specific text values or images are intentionally not included:

[Wireframe for page 1]

[Wireframe for page 2]
