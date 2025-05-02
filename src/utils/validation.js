const validator = require("validator");

const validateSignupData = (req) => {
  const { fullName, emailId, password } = req.body;
  if (!fullName) {
    throw new Error("Please enter all the required fields");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Please enter a valid email id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be : { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1}"
    );
  }
};

module.exports = { validateSignupData };
