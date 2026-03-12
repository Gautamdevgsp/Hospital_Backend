const bcrypt = require("bcrypt");
const User = require("../apis/user/userModel");

const seedAdmin = async () => {
  try {

    const existingAdmin = await User.findOne({
      email: "admin@gmail.com"
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("123456", 10);

    await User.create({
      name: "Super Admin",
      email: "admin@gmail.com",
      phone: "9999999999",
      password: hashedPassword,
      userType: 1
    });

    console.log("Admin created successfully");

  } catch (error) {
    console.log(error);
  }
};

module.exports = seedAdmin;