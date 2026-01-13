import { User } from "../../models/index.js";
import {
  authenticationError,
  invalidCredentialsError,
  resourceNotFoundError,
} from "../../utils/error-factories.js";
import { logger } from "../../utils/logger.js";
import { comparePassword, hashPassword } from "../../utils/password.js";

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw resourceNotFoundError("User");
  }

  const hasOAuth =
    user.oauth?.google?.id || user.oauth?.github?.id || user.oauth?.facebook?.id;
  if (hasOAuth) {
    throw authenticationError(
      "OAuth users cannot change password. Please use your social account login."
    );
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw invalidCredentialsError("Current password is incorrect");
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  logger.info("Password changed successfully", { userId });
};
