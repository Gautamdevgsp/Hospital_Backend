const User = require("../user/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { jwtSecret, jwtExpire } = require("../../config/config")

/* ---------------- LOGIN ---------------- */

const loginUser = async (req,res) => {

    try{

        const {email,password} = req.body

        if(!email || !password){
            return res.status(400).json({message:"Email and password required"})
        }

        const user = await User.findOne({email:email.toLowerCase(),isDeleted:false})

        if(!user){
            return res.status(404).json({message:"User not found"})
        }

        const valid = bcrypt.compareSync(password,user.password)

        if(!valid){
            return res.status(401).json({message:"Invalid password"})
        }

        if(!user.status){
            return res.status(403).json({message:"User blocked"})
        }

        const token = jwt.sign(
            {
                id:user._id,
                role:user.userType
            },
            jwtSecret,
            {expiresIn:jwtExpire}
        )

        res.json({
            message:"Login successful",
            token:token,
            userId:user._id,
            name:user.name,
            role:user.userType
        })

    }catch(error){

        res.status(500).json({error:error.message})

    }

}


const changePassword = async (req, res) => {
  try {

    const {oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        message: "oldPassword and newPassword are required"
      });
    }

    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Check old password
    const isMatch = bcrypt.compareSync(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Old password is incorrect"
      });
    }

    // Hash new password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Password changed successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

module.exports = {
    loginUser,
    changePassword
}