const fetchData = require('../utils/fetchData');

// 1. Multiple Fetch API - [GET] https://api.deezer.com/chart
//   - This endpoint fetches the charts for five categories:
//     1. tracks
//     2. albums
//     3. artists
//     4. playlists
//     5. podcasts
//   - { NO PARAMS }

const getDeezerChart = async (req, res) => {
  const [data, error] = await fetchData(`https://api.deezer.com/chart`);
  if (error) {
    return res
      .status(400)
      .json({
        success: false,
        error: 'Something went wrong',
      })
  }
  console.log(data);
  return res
    .status(200)
    .json({
      success: true,
      data: data.tracks.data
    });
}

// 2. Single Fetch API - [GET] https://api.deezer.com/track/{ trackId }
//   - This endpoint fetches the data for a specified track.
//   - Parameters: {
//       trackId: int
//     }

const getDeezerTrack = async (req, res) => {
  const [data, error] = await fetchData(`https://api.deezer.com/track/${req.params.id}`);
  if (error) {
    return res
      .status(400)
      .json({
        success: false,
        error: 'Something went wrong',
      })
  }
  console.log(data);
  return res
    .status(200)
    .json({
      success: true,
      data: data
    });
}

// // IGNORE FOR NOW, template/reference file

// const Fellow = require('../model/Fellow');

// /*
// These controllers take incoming requests and utilize the
// methods provided by the Fellow "model" before sending a
// response back to the client (or an error message).
// */

// // Get All (Read)
// const serveFellows = async (req, res) => {
//   const fellowsList = await Fellow.list();
//   res.send(fellowsList);
// }

// // Get One (Read)
// const serveFellow = async (req, res) => {
//   const { id } = req.params;
//   const fellow = await Fellow.find(Number(id));

//   if (!fellow) return res.status(404).send(`No fellow with the id ${id}`);
//   res.send(fellow);
// };

// // Create
// const createFellow = async (req, res) => {
//   const { fellowName } = req.body; // The POST request body will be an object: `{ fellowName: 'name' }`
//   const newFellow = await Fellow.create(fellowName);
//   res.send(newFellow);
// };

// // Update
// const updateFellow = async (req, res) => {
//   const { fellowName } = req.body;
//   const { id } = req.params;
//   const updatedFellow = await Fellow.editName(Number(id), fellowName);
//   // sendStatus sends just the status with no message body
//   if (!updatedFellow) return res.sendStatus(404);
//   res.send(updatedFellow);
// }

// // Delete
// const deleteFellow = async (req, res) => {
//   const { id } = req.params;
//   const didDelete = await Fellow.delete(Number(id));
//   const statusCode = didDelete ? 204 : 404;
//   res.sendStatus(statusCode);
// }

module.exports = {
  getDeezerChart,
  getDeezerTrack,
  // serveFellows,
  // serveFellow,
  // createFellow,
  // updateFellow,
  // deleteFellow
};
