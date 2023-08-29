import bcrypt from "bcrypt";

export const pass = {
  hash: (password) => {
    return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
  },
  compare: (password, hashedPassword) => {
    return bcrypt.compareSync(password, hashedPassword);
  },
};
