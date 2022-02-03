import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  try {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    console.log(error.toString());
  }
};

export const confirmPassword = async (password: string, hashedPass: string) => {
  return await bcrypt.compare(password, hashedPass);
};
