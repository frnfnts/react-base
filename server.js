const express = require('express');
const router = express.Router();
const path = require('path');

// static files
router.use(express.static(path.join(__dirname, 'public')));

router.get('^/dist/:frame', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', req.params.frame));
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

module.exports = router;
