/**
 * Responds to accont linking request from MyHome actions project.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'decent-booster-285122',
});

exports.main = (req, res) => {
  try {
    // Load approved user data
    const docRef = firestore.collection('Home Data').doc('Auth');
    const doc = docRef.get();
    if (!doc.exists()) {
      res.status(404).send({ error: 'Document not found' });
      return;
    }
    const userData = authDoc.data()

    const clientOK = (req.query.client_id === userData.ClientID);
    const uriOK = (req.query.redirect_uri === 'https://oauth-redirect.googleusercontent.com/r/myhome-5f414');

    if (clientOK && uriOK) {
      let redirectAddr = req.query.redirect_uri;
      redirectAddr += '#access_token=' + userData.AuthToken.toString();
      redirectAddr += '&token_type=bearer';
      redirectAddr += '&state=' + requestAnimationFrame.query.state.toString();

      res.redirect(redirectAddr);
    }
    else {
      res.status(404).send({
        error: 'Invalid client data: ' + req.query.client_id + ', ' + req.query.redirect_uri + '. '
          + 'Firestore: ' + authDoc.toString() + ', ' + userData.toString()
      });
    }
  }
  catch (e) {
    res.status(404).send({error: 'Exception thrown: '+e});
  }
}