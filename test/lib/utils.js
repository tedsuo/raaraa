var config = "../../config";

exports.createDBConnectUrl = function(test_db) {
    process.env.MONGO_CONNECT =
        "mongodb://"+config.db_host+":"+config.db_port+"/"+test_db;
}

