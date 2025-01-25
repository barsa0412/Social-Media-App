import UserModel from "../Models/userModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


// grt all users
export const getAllUsers = async (req, res) => {

    try {
        let users = await UserModel.find();
        
        users = users.map((user) => {
            const {password, ...otherDetails } = user._doc;
            return otherDetails;
        })

        res.status(200).json(users);

    } catch (error) {
        res.status(500).json(error);
    }
}



//get a user
export const getUser = async (req, res) =>{
    const id = req.params.id;
    
    try {

        const user = await UserModel.findById(id);

        if (user) {
            const {password, ...otherDetails } =user._doc
            res.status(200).json(otherDetails)
        } else {
            res.status(404).json("Please, Try again it is invalid user!")
        }
    }
    catch(error) {
        res.status(500).json(error)
    }
}


//update a user

export const updateUser = async (req, res) => {
    const id = req.params.id;

    const {_id, password } = req.body;

    if (id === _id) {

        if (password) {
            const salt = await bcrypt.genSalt(10);
            let pass = password.toString();
            req.body.password = await bcrypt.hash(pass, salt)
        }

        try {
            const user = await UserModel.findByIdAndUpdate(id, req.body, { new: true });

            const token = jwt.sign(
                { email: user.email, id: user_id },
                process.env.JWT_KEY
            );

            res.status(200).json({ user, token })
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access denied! You can only update your own profile")
    }
}



// delete a user

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    const { _id, currentUserAdminStatus } = req.body;

    if (_id === id || currentUserAdminStatus) {
        try {
            await UserModel.findByIdAndDelete(id);
            res.status(200).json("User deleted sucessfully")
        } catch (error) {
            res.status(500).json(error)
        }
    } else {
        res.status(403).json("Access Denied! You can only update your own profile")
    }
}



// follow a user
export const  followUser = async(req, res) => {
    const id = req.params.id;


    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (!followUser.followers.include(_id)) {
                await followUser.updateOne({ $push: { followers: _id} })
                await followingUser.updateOne({ $push: { following: _id} })

                res.status(200).json("User Followed!")
            } else {
                res.status(403).json("User is Already followed by you")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
}



// unfollow a user

export const UnFollowUser = async (req, res) => {
    const id = req.params.id;

    const { _id } = req.body;

    if (_id === id) {
        res.status(403).json("Action forbidden")
    } else {
        try {

            const followUser = await UserModel.findById(id);
            const followingUser = await UserModel.findById(_id);

            if (followUser.followers.include(_id)) {
                await followUser.updateOne({ $pull: {followers: _id} })
                await followingUser.updateOne({ $pull: {following: _id} })

                res.status(200).json("User Unfollowed!")
            } else {
                res.status(403).json("User is not followed by you")
            }

        } catch (error) {
            res.status(500).json(error)
        }
    }
}