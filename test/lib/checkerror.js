module.exports = function(err, test) {
  if (err) {
    test.ifError(err);
    test.done();
    return true;
  }
  return false;
}