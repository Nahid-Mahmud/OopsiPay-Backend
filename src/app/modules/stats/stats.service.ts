import { IsActive } from "../user/user.interface";
import User from "../user/user.model";

const now = new Date();

const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getUserStats = async () => {
  const totalUsersPromise = User.countDocuments();
  const activeUsersPromise = User.countDocuments({ isActive: IsActive.ACTIVE });
  const totalInactiveUsersPromise = User.countDocuments({ isActive: IsActive.INACTIVE });
  const totalBlockedUsersPromise = User.countDocuments({ isActive: IsActive.BLOCKED });
  const newUsersLast7DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(sevenDaysAgo) },
  });
  const newUsersLast30DaysPromise = User.countDocuments({
    createdAt: { $gte: new Date(thirtyDaysAgo) },
  });

  const userByRolePromise = User.aggregate([
    {
      $group: {
        _id: "$role",
        count: { $sum: 1 },
      },
    },
  ]);

  const [
    totalUsers,
    activeUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    userByRole,
  ] = await Promise.all([
    totalUsersPromise,
    activeUsersPromise,
    totalInactiveUsersPromise,
    totalBlockedUsersPromise,
    newUsersLast7DaysPromise,
    newUsersLast30DaysPromise,
    userByRolePromise,
  ]);

  return {
    totalUsers,
    activeUsers,
    totalInactiveUsers,
    totalBlockedUsers,
    newUsersLast7Days,
    newUsersLast30Days,
    userByRole,
  };
};

export const statsService = { getUserStats };
