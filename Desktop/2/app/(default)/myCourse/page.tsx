import path from 'path';
import fs from 'fs/promises';
import { User } from '../../../types/types';

async function fetchUserData(): Promise<User> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'userData.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function MyCourse() {
  const user = await fetchUserData();

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
      <p>Hello</p>
    </div>
  );
}
