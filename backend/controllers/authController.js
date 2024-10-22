const supabase = require('../supabase/supabase-client');

// Signup Controller
exports.signup = async (req, res) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(200).json({ message: 'Signup successful', data });
    }
  };

  
// Login Controller
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
      res.status(400).json({ error: error.message });
    } else {
      
      res.cookie('access_token', data.session.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.status(200).json({ message: 'Login successful', data });
    }
  };

  
// Logout Controller
exports.logout = (req, res) => {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out successfully' });
  };