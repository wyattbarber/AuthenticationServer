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
      var responseUrl = String(req.query.redirect_uri);
      responseUrl += '?code=';
      responseUrl += String(AuthToken);
      responseUrl += '&state=';
      responseUrl += String(req.query.state);
      res.redirect(responseUrl);
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
        access_token: String(token_value),
        refresh_token: String(token_value),
        expires_in: String(interval),
      };
    } else if (grantType === 'refresh_token') {
      token = {
        token_type: 'bearer',
        access_token: String(token_value),
        expires_in: String(interval),
      };
    } else {
      res.status(400).send({"error":"invalid_grant"})
    }
    res.status(200).json(token)
  }
  catch {
    res.status(400).send("error: invalid token request")
  }
}