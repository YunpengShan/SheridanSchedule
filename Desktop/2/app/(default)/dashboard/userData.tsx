import { User } from '../../../types/types';

interface UserDataProps {
  user: User;
}

export default function UserData({ user }: UserDataProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">User Information</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>School:</strong> {user.school}</p>
      <p><strong>Department:</strong> {user.department}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>UUID:</strong> {user.uuid}</p>
      <h3 className="text-xl font-bold mt-6 mb-2">Courses</h3>
      {user.courses.map((course, index) => (
        <div key={index} className="mb-4">
          <h4 className="text-lg font-bold">{course.name}</h4>
          <h5 className="font-semibold mt-2">Course Materials:</h5>
          <ul className="list-disc list-inside">
            {course.course_material.map((material, index) => (
              <li key={index}>{material.filename}</li>
            ))}
          </ul>
          <h5 className="font-semibold mt-2">Assignments:</h5>
          {course.assignments.map((assignment, index) => (
            <div key={index} className="mt-2">
              <h6 className="font-semibold">{assignment.assignment_name}</h6>
              <p><strong>Rubric:</strong> {assignment.rubric}</p>
              <h6 className="font-semibold mt-2">Statistics:</h6>
              <p><strong>Average:</strong> {assignment.stats.average}</p>
              <p><strong>Median:</strong> {assignment.stats.median}</p>
              <p><strong>Number of Submissions:</strong> {assignment.stats.num_submission}</p>
              <p><strong>Graded Submissions:</strong> {assignment.stats.graded_submission}</p>
              <h6 className="font-semibold mt-2">Submissions:</h6>
              <ul className="list-disc list-inside">
                {assignment.submissions.map((submission, index) => (
                  <li key={index}>
                    <p><strong>File:</strong> {submission.submission_name}</p>
                    <p><strong>Student ID:</strong> {submission.submission_student_id}</p>
                    <p><strong>Graded:</strong> {submission.graded ? 'Yes' : 'No'}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
