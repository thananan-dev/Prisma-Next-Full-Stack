export enum RESPONSE_MESSAGES {
  EMAIL_ALREADY_EXIST = "The email address you entered is already registered. Please use a different email or log in if you already have an account.",
  USER_CREATE_SUCCESS = "User account successfully created. Welcome aboard!",
  USER_UPDATE_SUCCESS = "User details successfully updated.",
  USER_DELETE_SUCCESS = "User account successfully deleted.",
  POST_CREATE_SUCCESS = "Your post has been successfully created.",
  NOT_FOUND_USER = "No user in database",
  POST_UPDATE_SUCCESS = "Your post has been successfully updated.",
  POST_DELETE_SUCCESS = "Your post has been successfully deleted.",
  ACCOUNT_CREATE_SUCCESS = "Account account successfully created. Welcome aboard!",
  ACCOUNT_UPDATE_SUCCESS = "Account details successfully updated.",
  ACCOUNT_DELETE_SUCCESS = "Account account successfully deleted.",
  LOGGED_IN_SUCCESS = "Logged in Successfully",
  NO_SECRET_PROVIDED = "No secret key provided",
}

export enum MIDDLEWARE_MESSAGES {
  TOKEN_EXPIRE = "Token has expired",
  INVALID_TOKEN = "Invalid token",
  VALID_TOKEN = "Valid token",
  USER_NOT_FOUND = "User not found",
  WRONG_PASSWORD = "Wrong Password",
  NOT_FOUND_REFRESH_TOKEN_IN_DATABASE = "Invalid refresh token",
  VERIFY_REFRESH_TOKEN_ERROR = "Invalid or expired refresh token",
}
