// src/app/myCourse/[courseName]/assignments/[assignmentName]/stats/page.tsx
import Sidebar from '@/components/ui/sidebar';
import { fetchUserData } from '../../../../../../../lib/fetchUserData';
import { Stats, User } from '../../../../../../../types/types';

export const metadata = {
  title: 'Assignment Stats - Mosaic',
  description: 'Page description',
};

interface StatsPageProps {
  params: {
    courseName: string;
    assignmentName: string;
  };
}

export default async function StatsPage({ params }: StatsPageProps) {
  const { courseName, assignmentName } = params;
  const userData: User = await fetchUserData();
  const course = userData.courses.find((course) => course.name === courseName);
  const assignment = course?.assignments.find((assignment) => assignment.assignment_name === assignmentName);
  const stats: Stats | null = assignment ? assignment.stats : null;

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="flex">
      {/* <Sidebar user={userData} /> */}
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <h2 className="text-2xl font-bold mb-4">Stats for {assignmentName}</h2>
        <p><strong>Average:</strong> {stats.average}</p>
        <p><strong>Median:</strong> {stats.median}</p>
        <p><strong>Number of Submissions:</strong> {stats.num_submission}</p>
        <p><strong>Graded Submissions:</strong> {stats.graded_submission}</p>
      </div>
    </div>
  );
}
