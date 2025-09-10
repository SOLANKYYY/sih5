
import { GoogleGenAI, Type } from '@google/genai';
import type { Course, Faculty, Classroom, Timetable } from '../types';
import { daysOfWeek, timeSlots } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. In a real environment, the key should be set.
  console.warn("API_KEY environment variable not set. Using a placeholder. The app will not function correctly without a valid API key.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const scheduleEntrySchema = {
  type: Type.OBJECT,
  properties: {
    timeSlot: { type: Type.STRING, description: "The time slot for the class, e.g., '09:00 - 10:00'." },
    courseCode: { type: Type.STRING, description: "The unique code for the course, e.g., 'CS101'." },
    courseName: { type: Type.STRING, description: "The full name of the course, e.g., 'Introduction to Computer Science'." },
    facultyName: { type: Type.STRING, description: "The name of the faculty member teaching the class." },
    classroomName: { type: Type.STRING, description: "The name of the classroom where the class is held." },
    department: { type: Type.STRING, description: "The department offering the course." },
    studentGroup: { type: Type.STRING, description: "The group of students attending this class, e.g., 'Year 1 CompSci'." }
  },
  required: ["timeSlot", "courseCode", "courseName", "facultyName", "classroomName", "department", "studentGroup"]
};

const timetableSchema = {
    type: Type.OBJECT,
    properties: {
        timetable: {
            type: Type.OBJECT,
            properties: {
                monday: { type: Type.ARRAY, items: scheduleEntrySchema },
                tuesday: { type: Type.ARRAY, items: scheduleEntrySchema },
                wednesday: { type: Type.ARRAY, items: scheduleEntrySchema },
                thursday: { type: Type.ARRAY, items: scheduleEntrySchema },
                friday: { type: Type.ARRAY, items: scheduleEntrySchema },
            },
        },
    },
    required: ["timetable"]
};

const buildPrompt = (courses: Course[], faculty: Faculty[], classrooms: Classroom[]): string => {
  return `
    You are an expert university timetable scheduler AI. Your task is to generate an optimal, conflict-free weekly timetable for a university department based on the provided constraints. The output MUST be a JSON object that strictly adheres to the provided schema.

    **Core Constraints:**

    **1. Time Slots:**
    The available time slots for scheduling are: ${timeSlots.join(', ')}.
    The academic week runs from Monday to Friday.

    **2. Available Classrooms:**
    ${JSON.stringify(classrooms, null, 2)}

    **3. Available Faculty and their Availability:**
    ${JSON.stringify(faculty.map(f => ({ name: f.name, department: f.department, availability: f.availability })), null, 2)}

    **4. Courses to be Scheduled:**
    ${JSON.stringify(courses.map(c => ({ code: c.code, name: c.name, department: c.department, studentGroup: c.studentGroup, requiredEquipment: c.requiredEquipment })), null, 2)}

    **Scheduling Rules (MUST be followed):**

    1.  **No Conflicts:**
        - A faculty member cannot teach more than one class at the same time.
        - A classroom cannot be used for more than one class at the same time.
        - A student group (e.g., 'Year 1 CompSci') cannot attend more than one class at the same time.

    2.  **Faculty Availability:** Schedule classes for a faculty member ONLY during their specified available time slots.

    3.  **Classroom Suitability:**
        - A classroom must have all the equipment required by the course.
        - Do not consider classroom capacity, assume it is sufficient.

    4.  **Workload Balancing:** Distribute the teaching load as evenly as possible among the available faculty members. Avoid scheduling one faculty member for too many consecutive hours. Aim for a balanced and fair schedule.

    5.  **Completeness:** Ensure every course listed is scheduled exactly once in the week.

    Generate the complete timetable for one full week (Monday to Friday). The final output must be a single JSON object matching the schema. Do not include any text or explanations outside of the JSON object.
  `;
};

export const generateTimetable = async (
  courses: Course[],
  faculty: Faculty[],
  classrooms: Classroom[]
): Promise<Timetable> => {
  if (!API_KEY) {
    throw new Error("API_KEY is not configured. Please set the environment variable.");
  }

  const prompt = buildPrompt(courses, faculty, classrooms);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: timetableSchema,
        temperature: 0.2, // Lower temperature for more deterministic output
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);

    if (result && result.timetable) {
      return result.timetable;
    } else {
      console.error("Generated JSON does not match expected structure:", result);
      throw new Error("Failed to generate a valid timetable structure.");
    }

  } catch (error) {
    console.error('Error generating timetable with Gemini API:', error);
    throw new Error('The AI failed to generate a timetable. This could be due to conflicting constraints or an API issue. Please check your inputs and try again.');
  }
};
