
export enum Role {
  Authority = 'Authority',
  Student = 'Student',
}

export interface Course {
  id: string;
  name: string;
  code: string;
  department: string;
  studentGroup: string; // e.g., 'Year 1 CompSci'
  requiredEquipment: string[];
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  availability: {
    day: string;
    timeSlots: string[];
  }[];
}

export interface Classroom {
  id: string;
  name: string;
  capacity: number;
  availableEquipment: string[];
}

export const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
];

export const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export interface ScheduleEntry {
  timeSlot: string;
  courseCode: string;
  courseName: string;
  facultyName: string;
  classroomName: string;
  department: string;
  studentGroup: string;
}

export type Timetable = {
  [day in 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday']?: ScheduleEntry[];
};
