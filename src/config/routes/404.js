module.exports = function (req, res) {
  
  res.status(404).send({
    message: 'The object you requested was not found.'
  });
}