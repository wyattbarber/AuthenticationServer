const firestore = require('./firestore');

/**
 * Responds to accont linking request from MyHome actions project.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

exports.authorize = (req, res) => {
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
}

/**
 * Responds to token request/refresh requests.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */
exports.token = (req, res) => {
  try {
    const grantType = req.query.grant_type
      ? req.query.grant_type
      : req.body.grant_type;
    const interval = 86400;

    const data = firestore.getUserData(req, res);
    const token_value = data.AuthToken;

    let token;
    if (grantType === 'authorization_code') {
      token = {
        token_type: 'bearer',
        access_token: token_value,
        refresh_token: token_value,
        expires_in: interval,
      };
    } else if (grantType === 'refresh_token') {
      token = {
        token_type: 'bearer',
        access_token: token_value,
        expires_in: interval,
      };
    }
    res.status(200).json(token)
  }
  catch {
    res.status(400).send("error: invalid token request")
  }
}