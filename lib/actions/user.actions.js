import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Props {
  id: string;
  username: string;
  email: string;
  image: string;
  provider: string;
  calendar: any;
}

export async function createUser({
  id,
  username,
  email,
  image,
  provider,
  calendar,
}: Props) {
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
