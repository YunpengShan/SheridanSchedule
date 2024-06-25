import Sidebar from '@/components/ui/sidebar';
import Header from '@/components/ui/header';
import { fetchUserData } from '@/lib/fetchUserData';
import { User } from '@/types/types';

export default async function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user: User = await fetchUserData();

  return (
    <div className="flex h-[100dvh] overflow-hidden">
      <Sidebar user={user} />

      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header />

        <main className="grow [&>*:first-child]:scroll-mt-16">
          {children}
        </main>
      </div>
    </div>
  );
}
