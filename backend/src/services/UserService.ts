import { User, IUser } from '../models/User.js';
import { NotFound } from '../middleware/errorHandler.js';

export class UserService {
  async getOrCreateUser(uid: string, email: string, displayName: string): Promise<IUser> {
    let user = await User.findById(uid);

    if (!user) {
      user = new User({
        _id: uid,
        email,
        displayName,
        notificationPreferences: {
          emailOnMatch: true,
          emailOnRecovery: true,
          emailOnVerification: true,
          emailWeeklyDigest: false,
        },
        stats: {
          itemsPosted: 0,
          itemsRecovered: 0,
          itemsClaimed: 0,
        },
      });
      await user.save();
    }

    return user;
  }

  async getUserById(uid: string): Promise<IUser> {
    const user = await User.findById(uid);
    if (!user) {
      throw NotFound('User not found');
    }
    return user;
  }

  async updateUserProfile(uid: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(uid, data, { new: true });
    if (!user) {
      throw NotFound('User not found');
    }
    return user;
  }

  async updateNotificationPreferences(uid: string, preferences: any): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      uid,
      { notificationPreferences: preferences },
      { new: true }
    );
    if (!user) {
      throw NotFound('User not found');
    }
    return user;
  }

  async incrementUserStats(uid: string, field: 'itemsPosted' | 'itemsRecovered' | 'itemsClaimed'): Promise<void> {
    await User.findByIdAndUpdate(
      uid,
      { $inc: { [`stats.${field}`]: 1 } }
    );
  }
}

export const userService = new UserService();
