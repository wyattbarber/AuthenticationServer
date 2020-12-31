/**
 * Responds to accont linking request from MyHome actions project.
 *
 * @param {!express:Request} req HTTP request context.
 * @param {!express:Response} res HTTP response context.
 */

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
  projectId: 'My Project',
});

exports.main = (req, res) => {
  // Load approved user data
  const userData = firestore.collection('Home Data')
    .doc('Auth')
    .get()
    .then(doc => {
      if (!(doc && doc.exists)){
        console.err('Document not found.');
        res.status(404).send({error: 'Unable to find document.'});
        return '';
      }
      return doc.data();
    }).catch(err => {
      console.error(err);
      res.status(404).send({error: 'Unable to retrieve document.'});
      return '';
    });

  // compare against recieved data
  const clientOK  = (req.query.client_id === userData.ClientID);
  const uriOK     = (req.query.redirect_uri === 'https://oauth-redirect.googleusercontent.com/r/myhome-5f414');
  
  if (clientOK && uriOK){
    let redirectAddr = req.query.redirect_uri;
    redirectAddr += '#access_token='+userData.AuthToken.toString();
    redirectAddr += '&token_type=bearer';
    redirectAddr += '&state='+requestAnimationFrame.query.state.toString();
    
    res.redirect(redirectAddr);
  }
  else{
    res.status(404).send({error: 'Invalid client data: '+req.query.client_id+', '+req.query.redirect_uri+'. '
    +'Firestore: '+userData.ClientID});
  }
}