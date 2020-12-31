admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

module.exports = {
    getUserData: async function(req, res) {
        const clientDoc = await db.collection('Home Data').doc(req.query.client_id).get();
        if (clientDoc.exists) {
            return clientDoc;
        }
        else {
            res.status(404).send({ error: 'Could not locate document for this client' });
            throw 'Error opening document';
        }
    }
};
