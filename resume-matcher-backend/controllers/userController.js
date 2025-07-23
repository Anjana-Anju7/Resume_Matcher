const { User, Analysis } = require('../models');
const { generateToken } = require('../middleware/auth');
const validationService = require('../services/validation');

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FIELDS',
            message: 'Name, email, and password are required.'
          }
        });
      }

      if (!validationService.validateEmail(email)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EMAIL',
            message: 'Please provide a valid email address.'
          }
        });
      }

      const passwordValidation = validationService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_PASSWORD',
            message: passwordValidation.message
          }
        });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists.'
          }
        });
      }

      // Create new user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password
      });

      await user.save();
      const token = generateToken(user._id);

      console.log(`✅ New user registered: ${user.email}`);

      res.status(201).json({
        success: true,
        data: {
          user: user.toJSON(),
          token
        },
        message: 'User registered successfully.'
      });

    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'REGISTRATION_FAILED',
          message: 'Failed to register user.'
        }
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required.'
          }
        });
      }

      // Find user
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password.'
          }
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password.'
          }
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      const token = generateToken(user._id);

      console.log(`✅ User logged in: ${user.email}`);

      res.json({
        success: true,
        data: {
          user: user.toJSON(),
          token
        },
        message: 'Login successful.'
      });

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'LOGIN_FAILED',
          message: 'Failed to login.'
        }
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = req.user;

      // Get user statistics
      const totalAnalyses = await Analysis.countDocuments({ userId: user._id });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayAnalyses = await Analysis.countDocuments({
        userId: user._id,
        createdAt: { $gte: today }
      });

      // Get recent analyses
      const recentAnalyses = await Analysis.find({ userId: user._id })
        .select('jobTitle companyName results.compatibilityScore createdAt')
        .sort({ createdAt: -1 })
        .limit(5);

      res.json({
        success: true,
        data: {
          user: user.toJSON(),
          statistics: {
            totalAnalyses,
            todayAnalyses,
            subscription: user.subscription,
            memberSince: user.createdAt
          },
          recentAnalyses
        }
      });

    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PROFILE_FETCH_FAILED',
          message: 'Failed to fetch profile.'
        }
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const user = req.user;

      if (name) {
        user.name = name.trim();
        await user.save();
      }

      res.json({
        success: true,
        data: {
          user: user.toJSON()
        },
        message: 'Profile updated successfully.'
      });

    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'PROFILE_UPDATE_FAILED',
          message: 'Failed to update profile.'
        }
      });
    }
  }
}

module.exports = new UserController();