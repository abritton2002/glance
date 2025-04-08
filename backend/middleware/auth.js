const supabase = require('../services/supabase');

const auth = async (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No auth token' });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token and get user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ message: error.message });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = auth;