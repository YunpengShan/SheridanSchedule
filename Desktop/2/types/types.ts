// src/types/types.ts
export interface Submission {
    submission_name: string;
    submission_student_id: number;
    graded: boolean;
    submission_index: number;
  }
  
  export interface Stats {
    average: number;
    median: number;
    num_submission: number;
    graded_submission: number;
  }
  
  export interface Assignment {
    assignment_name: string;
    rubric: string;
    stats: Stats;
    submissions: Submission[];
  }
  
  export interface CourseMaterial {
    filename: string;
  }
  
  export interface Course {
    name: string;
    course_material: CourseMaterial[];
    assignments: Assignment[];
  }
  
  export interface User {
    username: string;
    school: string;
    department: string;
    email: string;
    uuid: string;
    courses: Course[];
  }
  