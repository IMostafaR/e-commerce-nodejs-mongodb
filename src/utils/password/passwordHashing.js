import bcrypt from "bcrypt";

const hash = (password) => {
  return bcrypt.hashSync(password, Number(process.env.SALT_ROUNDS));
};

const compare = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};

export { hash, compare };
