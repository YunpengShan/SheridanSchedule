// src/lib/fetchUserData.ts
import path from 'path';
import fs from 'fs/promises';
import { User } from '../types/types';

export async function fetchUserData(): Promise<User> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'userData.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData) as User;
}
