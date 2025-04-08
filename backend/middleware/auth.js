const supabase = require('../services/supabase');

module.exports = async (req, res, next) => {
  try {
    // Get auth header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No authorization token' });
    }
    
    // Extract token
    const token = authHeader.split(' ')[1];
    
    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Add user to request
    req.user = data.user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Authentication failed' });
  }
};