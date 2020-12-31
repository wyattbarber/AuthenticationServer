/**
 * Responds to accont linking request from MyHome actions project.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

firestore = require('./firestore');

exports.main = (req, res) => {
  logging.log('Authorization request recieved');
  // Load approved user data for given client id
  let userData;
  try {
    userData = firestore.getUserData(req, res);
  }
  catch (e) {
    return;
  }

  // Validate data sent in request
  const uriOK = (req.query.redirect_uri === 'https://oauth-redirect.googleusercontent.com/r/myhome-5f414');

  if (uriOK) {
    let redirectAddr = req.query.redirect_uri;
    redirectAddr += '#access_token=' + userData.AuthToken.toString();
    redirectAddr += '&token_type=bearer';
    redirectAddr += '&state=' + requestAnimationFrame.query.state.toString();

    res.redirect(redirectAddr);
  }
  else {
    res.status(404).send({
      error: 'Invalid client data: ' + req.query.client_id + ', ' + req.query.redirect_uri + '. '
        + 'Firestore: ' + doc.toString() + ', ' + userData.toString()
    });
  }

}