const fetchJSON = require("../utils/fetchJSON");
const fetchAudio = require("../utils/fetchAudio");

const getDeezerChart = async (req, res) => {
  const [data, error] = await fetchJSON(`https://api.deezer.com/chart`);
  if (error) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }
  // console.log(data);
  return res.status(200).json({
    success: true,
    data: data.tracks.data,
  });
};

const getDeezerSearch = async (req, res) => {
  const [data, error] = await fetchJSON(
    `https://api.deezer.com/search?q=${req.query.q}`
  );
  // console.log(data);
  if (error) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }
  // console.log(data);
  return res.status(200).json({
    success: true,
    data: data.data,
    nextpage: data.next,
  });
};

const getDeezerTrack = async (req, res) => {
  const [data, error] = await fetchJSON(
    `https://api.deezer.com/track/${req.params.id}`
  );
  if (error) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }
  return res.status(200).json({
    success: true,
    data: data,
  });
};

const getTrackFile = async (req, res) => {
  const [blob, error] = await fetchAudio(req.query.url);
  if (error) {
    return res.status(400).json({
      success: false,
      error: "Something went wrong",
    });
  }
  // console.log('blob data: ', blob);
  // console.log('blob data size: ', blob.size);
  try {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', blob.size);
    // res.send(blob);
    res.send(Buffer.from(await blob.arrayBuffer()));
  } catch (error) {
    console.error('error sending blob back: ', error);
    res.status(500).send('Error fetching audio blob from server');
  }
};

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
  getDeezerSearch,
  getTrackFile,
  // serveFellows,
  // serveFellow,
  // createFellow,
  // updateFellow,
  // deleteFellow
};
