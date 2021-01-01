/**
 * Responds to accont linking request from MyHome actions project.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

firestore = require('./firestore');

exports = {
  authorize: function (req, res) {
    // Load approved user data for given client id
    let userData;
    let AuthToken;
    try {
      userData = firestore.getUserData(req, res);
      AuthToken = userData.AuthToken;
    }
    catch (e) {
      return;
    }

    // Validate data sent in request
    try {
      const uriOK = (req.query.redirect_uri === 'https://oauth-redirect.googleusercontent.com/r/myhome-5f414');
      if (uriOK) {
        let redirectAddr = req.query.redirect_uri;
        redirectAddr += '#access_token=' + AuthToken;
        redirectAddr += '&token_type=bearer';
        redirectAddr += '&state=' + req.query.state;

        res.redirect(redirectAddr);
      }
      else {
        res.status(404).send({
          error: 'Invalid client data: ' + req.query.client_id + ', ' + req.query.redirect_uri
        });
      }
    }
    catch (e) {
      res.status(404).send({ error: 'Exception thrown: ' + e });
    }
  },

  token: function (req, res) {
    
  }
}