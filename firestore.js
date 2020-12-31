admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

const {Logging} = require('@google-cloud/logging');
const logging = new Logging;


module.exports = {
    getUserData: async function(req, res) {
        logging.log('Accessing authorization data');
        const clientDoc = await db.collection('Home Data').doc(req.query.client_id).get();
        if (clientDoc.exists) {
            logging.log('Authorization data found')
            return clientDoc;
        }
        else {
            logging.log('Authorization data not found')
            res.status(404).send({ error: 'Could not locate document for this client' });
            throw 'Error opening document';
        }
    }
};
