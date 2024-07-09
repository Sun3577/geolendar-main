import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Props {
  id: string;
  username: string;
  email: string;
  image: string;
  provider: string;
}

export async function createUser({
  id,
  username,
  email,
  image,
  provider,
}: Props) {
  try {
    connectToDB();

    await User.create({
      id,
      username,
      email,
      image,
      provider,
    });
  } catch (error) {
    console.log(error);
  }
}
