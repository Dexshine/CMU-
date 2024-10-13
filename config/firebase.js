const admin = require("firebase-admin");
const { SERVICE_ACCOUNT_KEY } = require("../variable-config");

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT_KEY),
  storageBucket: "event-finding.appspot.com",
});

const bucket = admin.storage().bucket();

module.exports = bucket;
