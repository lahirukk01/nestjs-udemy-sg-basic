import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

export const scrypt = promisify(_scrypt);

export async function hashPasswordWithSalt(password: string, salt?: string) {
  if (!salt) {
    salt = (await randomBytes(8)).toString('hex');
  }

  const hashedPasswordBuffer = (await scrypt(password, salt, 64)) as Buffer;
  const hashedPassword = hashedPasswordBuffer.toString('hex');
  const passwordToStore = `${salt}.${hashedPassword}`;

  return { passwordToStore, salt, hashedPassword };
}
