import { hashSync, compareSync, genSaltSync } from 'bcryptjs';

export function encodePassword(rawPassword: string) {
  const SALT = genSaltSync();
  return hashSync(rawPassword, SALT);
}

export function comparePassword(rawPassword: string, hash: string) {
  return compareSync(rawPassword, hash);
}
