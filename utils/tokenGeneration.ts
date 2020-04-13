import jwt from "jsonwebtoken";
import config from "../config";

export const tokenGeneration = (id: string) => {
  return jwt.sign(
    {id: id},
    config.JWT_SECRET,
    {expiresIn: 3600}
  );
};