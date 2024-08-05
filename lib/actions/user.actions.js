import User from "../models/user.model";
import { connectToDB } from "../mongoose";

export async function createUser({
  id,
  username,
  email,
  image,
  provider,
  calendar,
}) {
  try {
    await connectToDB();

    const newUser = await User.create({
      id,
      username,
      email,
      image,
      provider,
      calendar,
    });
  } catch (error) {
    console.log(error);
  }
}
