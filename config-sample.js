config = {
  development: {
    session_secret: "changeme",
    encryption_key: 'changeme',
    db_host: 'localhost',
    db_port: 27017,
    db_name: 'raaraa' 
  },
  test: {
    session_secret: "changeme",
    encryption_key: 'changeme',
    db_host: 'localhost',
    db_port: 27017,
    db_name: 'raaraa_test'
  }  
};

module.exports = config;
