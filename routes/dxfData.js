const express = require('express');
const cors = require("cors")
const router = express.Router();
const dxfData = require('../services/dxfData');

/* GET quotes listing. */
router.get('/', cors(), async function(req, res, next) {
  try {
    res.json(await dxfData.getDXF());
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = router;
