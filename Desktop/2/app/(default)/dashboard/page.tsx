import path from 'path';
import fs from 'fs/promises';
import Sidebar from '../../../components/ui/sidebar';
import WelcomeBanner from './welcome-banner';
import UserData from './userData';
import { User } from '../../../types/types';

export const metadata = {
  title: 'Dashboard - Mosaic',
  description: 'Page description',
};

async function fetchUserData(): Promise<User> {
  const filePath = path.join(process.cwd(), 'public', 'data', 'userData.json');
  const jsonData = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(jsonData);
}

export default async function Dashboard() {
  const user = await fetchUserData();

  return (
    <div className="flex">
       {/* <Sidebar user={user} /> */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <WelcomeBanner/>
        <UserData user={user} />
      </div>
    </div>
  );
}
