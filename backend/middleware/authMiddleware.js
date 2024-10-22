const supabase = require('../supabase/supabase-client');

const authMiddleware = async (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }

  const { data: user, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

module.exports = authMiddleware;
