const express = require('express');
const router = express.Router();
const dxfData = require('../services/dxfData');

/* GET quotes listing. */
router.get('/', async function(req, res, next) {
  try {
    res.json(await dxfData.getDXF());
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

module.exports = router;
