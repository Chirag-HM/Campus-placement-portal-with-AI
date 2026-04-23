import User from '../models/User.js';

export const awardXP = async (userId, amount) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.xp += amount;
    
    // Level up logic
    let leveledUp = false;
    const nextLevelXp = user.level * 500;
    
    if (user.xp >= nextLevelXp) {
      user.xp -= nextLevelXp;
      user.level += 1;
      leveledUp = true;
      
      // Auto-award badges for levels
      if (user.level === 2) user.badges.push({ name: 'Rising Star', icon: 'Star' });
      if (user.level === 5) user.badges.push({ name: 'Placement Ready', icon: 'Shield' });
    }

    await user.save();
    return { xp: user.xp, level: user.level, leveledUp };
  } catch (error) {
    console.error('Error awarding XP:', error);
    return null;
  }
};

export const handleLoginStreak = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastLogin = user.lastLoginDate ? new Date(user.lastLoginDate) : null;
    if (lastLogin) lastLogin.setHours(0, 0, 0, 0);

    let streakUpdated = false;
    let xpAwarded = 0;

    if (!lastLogin) {
      // First ever login
      user.streak.count = 1;
      user.streak.lastAwarded = today;
      streakUpdated = true;
      xpAwarded = 10;
    } else {
      const diffTime = today - lastLogin;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        user.streak.count += 1;
        user.streak.lastAwarded = today;
        streakUpdated = true;
        xpAwarded = 10 + (user.streak.count * 2); // Increasing reward
      } else if (diffDays > 1) {
        // Streak broken
        user.streak.count = 1;
        user.streak.lastAwarded = today;
        streakUpdated = true;
        xpAwarded = 10;
      }
      // If diffDays === 0, already logged in today, do nothing
    }

    if (streakUpdated) {
      if (user.streak.count > user.streak.highest) {
        user.streak.highest = user.streak.count;
      }
      user.lastLoginDate = new Date();
      await user.save();
      const xpResult = await awardXP(userId, xpAwarded);
      return { streak: user.streak, xpAwarded, ...xpResult };
    }

    return null;
  } catch (error) {
    console.error('Error handling streak:', error);
    return null;
  }
};
