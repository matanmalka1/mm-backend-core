import { User } from "../../models/User.js";
import { sanitizeUser } from "../../utils/auth-helpers.js";
import { resourceNotFoundError } from "../../utils/error-factories.js";
import { logger } from "../../utils/logger.js";

export const updateProfile = async (userId, profileData) => {
  const user = await User.findById(userId).populate({
    path: "role",
    populate: { path: "permissions" },
  });

  if (!user) {
    throw resourceNotFoundError("User");
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "bio",
    "profilePicture",
  ];
  const updates = {};

  for (const field of allowedFields) {
    if (profileData[field] !== undefined) {
      updates[field] = profileData[field];
    }
  }

  if (profileData.shippingAddress !== undefined) {
    updates.defaultShippingAddress = profileData.shippingAddress;
  }

  Object.assign(user, updates);
  await user.save();

  const userObject = sanitizeUser(user);

  logger.info("Profile updated successfully", { userId });

  return userObject;
};
