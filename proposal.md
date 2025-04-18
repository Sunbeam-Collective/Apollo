# Apollo

Created by Raffy and Jordi.

## 🚀 Mission statement

Our application, Apollo is for music enthusiasts who love to tweak their favorite songs. It allows users to adjust the speed and pitch of songs as well as share their unique mixes with the world.

## API & React Router

This application will use the API. Below are the documentation and specific endpoints we intend to use and the front-end pages that will use them.

API - [DEEZER API](https://api.deezer.com/)
1. Multiple Fetch API - [GET] https://api.deezer.com/chart
  - This endpoint fetches the charts for five categories:
    1. tracks
    2. albums
    3. artists
    4. playlists
    5. podcasts
  - { NO PARAMS }
2. Single Fetch API - [GET] https://api.deezer.com/track/{ trackId }
  - This endpoint fetches the data for a specified track.
  - Parameters: {
      trackId: int
    }
3. Search API - [GET] https://api.deezer.com/search?q={ searchTerm }{ opts }
  - This endpoint returns all tracks that match the query.
  - Parameters: {
    searchTerm: string,
  }
  - Opts: {
    artist: string,
    album: string,
    track: string,
  }

## 👩‍💻 MVP User Stories & Frontend Routes

The application will feature the following frontend routes and core features:

- The `/` page is a landing page which handles redirections on whether the user is logged in or not
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

- **Figma:** https://www.figma.com/design/55M9F778PTRRyvWlMFl0QL/Cutframe.in--(wireframe-kit)-(Community)?node-id=603-21955&t=fdg904W1kmhjEzBP-1
