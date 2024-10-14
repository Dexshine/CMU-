const admin = require("firebase-admin");
const { SERVICE_ACCOUNT_KEY, STORAGE_BUCKET } = require("../variable-config");

admin.initializeApp({
  credential: admin.credential.cert(SERVICE_ACCOUNT_KEY),
  storageBucket: STORAGE_BUCKET,
});

const bucket = admin.storage().bucket();

module.exports = bucket;
