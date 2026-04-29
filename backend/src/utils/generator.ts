import crypto from 'crypto';
import bcrypt from 'bcrypt';

export function UUIDGenerator(length: number = 30): string {
  if (length <= 0) {
    throw new Error("Length must be greater than zero");
  }

  const randomBytes = crypto.randomBytes(length);

  const randomString = randomBytes.toString('hex');

  return randomString;
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; 
  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function comparePassword(enteredpassword : string, password : string): Promise<Boolean>{

  const compareresult = await bcrypt.compare(enteredpassword, password);

  return compareresult;
}