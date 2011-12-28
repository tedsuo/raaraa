module.exports = {
  randomUser: function() {
    return {
      username: 'test_'+Date.now(),
      password: 'password'
    };
  }
};