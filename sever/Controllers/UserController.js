import UserModel from '../Models/userModel.js';
import bcrypt from 'bcryp';
import jwt from 'jsonwebtoken';


//register for new users
export const registerUser = async (req, res) => {

    const {email, password } = req.body;

    const salt = await bcrypt.genSalt(10);
    let pass = password.toString();
    const hashedpass = await bcrypt.hash(pass, parseInt(salt));
    req.body.password = hashedpass;

    const newUser = new UserModel(req.body);


    try {

        const olduser = await UserModel.findOne({ email });

        if (olduser) {
            return res.status(400).json({ message: "This User already exists" })
        }

        const user = await newUser.save();

        const token = jwt.sign({email: user.email, id: user_id }, process.env.jwt_KEY);

        res.status(200).json({ user, token });
    } catch(error) {
        res.status(500).json({ message: error.message });
    }
}


// login users

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });

        id (user) {
            const validity = await bcrypt.cpmpare(password, user.password)

            if (!validity) {
                res.status(400).json("Soory, Please enter the correct email or password!");
            } else {
                const token = jwt.sign({email: user.email, id: user._id }, process.env.JWT_KEY);
                res.status(200).json({user, token });
            }
        } else {
            res.status(404).json("soory, Please enter the correct email or password!")
        }
    } catch (error) {
        res.status(500).json({message: error.message })
    }
}

