import {
  AdminModel,
  AdminSessionModel,
  UserModel,
  UserSessionModel,
} from "@src/models/db/index.ts";

declare global {
  module Express {
    interface Locals {
      user?: UserModel;
      user_session?: UserSessionModel;
      admin?: AdminModel;
      admin_session?: AdminSessionModel;
    }
  }
}
