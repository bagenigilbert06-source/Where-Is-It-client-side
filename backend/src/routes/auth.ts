import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { userService } from '../services/UserService.js';
import { body, validationResult } from 'express-validator';
import { BadRequest } from '../middleware/errorHandler.js';

const router = Router();

// Verify token and get user
router.post('/verify', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await userService.getOrCreateUser(
      req.user.uid,
      req.user.email || '',
      'User'
    );

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        profileImage: user.profileImage,
        location: user.location,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const user = await userService.getUserById(req.user.uid);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// Update user profile with validation
router.put('/profile', authMiddleware, [
  body('displayName').optional().isString().trim(),
  body('location').optional().isString().trim(),
  body('profileImage').optional().isURL(),
], async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw BadRequest('Invalid input fields');
    }

    const user = await userService.updateUserProfile(req.user.uid, req.body);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
});

// Update notification preferences
router.put('/notifications', authMiddleware, async (req: AuthRequest, res, next) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { emailOnMatch, emailOnRecovery, emailOnVerification, emailWeeklyDigest } = req.body;

    const preferences = {
      emailOnMatch: typeof emailOnMatch === 'boolean' ? emailOnMatch : true,
      emailOnRecovery: typeof emailOnRecovery === 'boolean' ? emailOnRecovery : true,
      emailOnVerification: typeof emailOnVerification === 'boolean' ? emailOnVerification : true,
      emailWeeklyDigest: typeof emailWeeklyDigest === 'boolean' ? emailWeeklyDigest : false,
    };

    const user = await userService.updateNotificationPreferences(req.user.uid, preferences);
    res.json({ success: true, preferences: user.notificationPreferences });
  } catch (error) {
    next(error);
  }
});

export default router;
