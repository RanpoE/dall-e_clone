import { getAuth } from 'firebase-admin/auth';

const authenticateUser = async (req, res, next) => {
    try {
      const idToken = req.headers.authorization?.split('Bearer ')[1];
      if (!idToken) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      // Verify the ID token
      const decodedToken = await getAuth().verifyIdToken(idToken);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Error verifying auth token:', error);
      res.status(401).json({ error: 'Unauthorized' });
    }
  };

  export default authenticateUser