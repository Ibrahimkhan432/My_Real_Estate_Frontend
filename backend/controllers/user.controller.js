import { errorHandler } from "../utils/error.js";
import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import Listing from "../models/listing.model.js";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can update only your account!"));
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          img: req.body.img,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.params.id !== req.params.id)
    return next(errorHandler(403, "You can delete only your account!"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ userRef: req.params.id });
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
}

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    {
      if (!user) return errorHandler(404, "User not found");
      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};
