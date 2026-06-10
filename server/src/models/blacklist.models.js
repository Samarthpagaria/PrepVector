import mongoose from "mongoose";

const blacklistTokenScehma = new mongoose.Schema({
  token: {
    type: String,
    required: [true, "Token is required to be added in the blacklist"],
  },
});

export const BlacklistToken = mongoose.model(
  "BlacklistToken",
  blacklistTokenScehma
);
  