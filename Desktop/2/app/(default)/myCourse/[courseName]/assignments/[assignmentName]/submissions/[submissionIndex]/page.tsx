// src/app/myCourse/[courseName]/assignments/[assignmentName]/submissions/[submissionIndex]/page.tsx
import { fetchUserData } from '../../../../../../../../lib/fetchUserData';
import { User, Submission } from '../../../../../../../../types/types';

interface SubmissionPageProps {
  params: {
    courseName: string;
    assignmentName: string;
    submissionIndex: string;
  };
}

export default async function SubmissionPage({ params }: SubmissionPageProps) {
  const { courseName, assignmentName, submissionIndex } = params;
  const userData: User = await fetchUserData();
  const course = userData.courses.find((course) => course.name === courseName);
  const assignment = course?.assignments.find((assignment) => assignment.assignment_name === assignmentName);
  const submission = assignment?.submissions.find((submission) => submission.submission_index === Number(submissionIndex));

  if (!submission) return <div>No submission found</div>;

  return (
    <div className="flex">
      <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-[96rem] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Submission #{submission.submission_index} for {assignmentName}</h1>
        <p><strong>Submission Name:</strong> {submission.submission_name}</p>
        <p><strong>Student ID:</strong> {submission.submission_student_id}</p>
        <p><strong>Graded:</strong> {submission.graded ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
}
