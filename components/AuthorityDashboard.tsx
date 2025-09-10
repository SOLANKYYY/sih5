
import React, { useState, useCallback, useEffect } from 'react';
import type { Course, Faculty, Classroom, Timetable } from '../types';
import { daysOfWeek, timeSlots } from '../types';
import { generateTimetable } from '../services/geminiService';
import TimetableView from './TimetableView';
import Header from './Header';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronUpIcon, AcademicCapIcon, BuildingOfficeIcon, UsersIcon, SparklesIcon } from './icons/Icons';
import Spinner from './Spinner';

const initialCourses: Course[] = [
    { id: 'c1', name: 'Intro to AI', code: 'CS461', department: 'Computer Science', studentGroup: 'Year 4 CS', requiredEquipment: ['Projector'] },
    { id: 'c2', name: 'Data Structures', code: 'CS201', department: 'Computer Science', studentGroup: 'Year 2 CS', requiredEquipment: ['Projector', 'Whiteboard'] },
    { id: 'c3', name: 'Calculus II', code: 'MA202', department: 'Mathematics', studentGroup: 'Year 2 Math', requiredEquipment: ['Whiteboard'] },
];

const initialFaculty: Faculty[] = [
    { id: 'f1', name: 'Dr. Alan Turing', department: 'Computer Science', availability: [{ day: 'Monday', timeSlots: ['09:00 - 10:00', '10:00 - 11:00'] }, { day: 'Wednesday', timeSlots: ['14:00 - 15:00'] }] },
    { id: 'f2', name: 'Dr. Ada Lovelace', department: 'Computer Science', availability: [{ day: 'Tuesday', timeSlots: ['11:00 - 12:00', '12:00 - 13:00'] }] },
    { id: 'f3', name: 'Dr. Isaac Newton', department: 'Mathematics', availability: [{ day: 'Friday', timeSlots: ['09:00 - 10:00', '10:00 - 11:00'] }] },
];

const initialClassrooms: Classroom[] = [
    { id: 'r1', name: 'Hall A', capacity: 100, availableEquipment: ['Projector', 'Whiteboard'] },
    { id: 'r2', name: 'Lab B', capacity: 50, availableEquipment: ['Projector'] },
    { id: 'r3', name: 'Room C101', capacity: 70, availableEquipment: ['Whiteboard'] },
];

const Accordion: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode; }> = ({ title, icon, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4 font-semibold text-lg text-gray-700">
                <div className="flex items-center gap-3">
                    {icon}
                    <span>{title}</span>
                </div>
                {isOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
            {isOpen && <div className="p-4 border-t border-gray-200">{children}</div>}
        </div>
    );
};

const AuthorityDashboard: React.FC<{ userEmail: string; onLogout: () => void; }> = ({ userEmail, onLogout }) => {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [faculty, setFaculty] = useState<Faculty[]>(initialFaculty);
    const [classrooms, setClassrooms] = useState<Classroom[]>(initialClassrooms);
    const [timetable, setTimetable] = useState<Timetable | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState('');

    const loadingMessages = [
        "Initializing AI scheduling core...",
        "Analyzing constraints and resources...",
        "Evaluating potential conflicts...",
        "Optimizing faculty workload distribution...",
        "Allocating classroom resources...",
        "Running thousands of simulations...",
        "Finalizing timetable structure...",
        "Almost there, polishing the schedule...",
    ];

    useEffect(() => {
        let messageInterval: NodeJS.Timeout;
        if (isLoading) {
            let i = 0;
            setLoadingMessage(loadingMessages[i]);
            messageInterval = setInterval(() => {
                i = (i + 1) % loadingMessages.length;
                setLoadingMessage(loadingMessages[i]);
            }, 2500);
        }
        return () => {
            if (messageInterval) clearInterval(messageInterval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    const handleGenerate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setTimetable(null);

        if (courses.length === 0 || faculty.length === 0 || classrooms.length === 0) {
            setError("Please add at least one course, faculty member, and classroom before generating a timetable.");
            setIsLoading(false);
            return;
        }

        try {
            const generated = await generateTimetable(courses, faculty, classrooms);
            setTimetable(generated);
        } catch (err: any) {
            setError(err.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    }, [courses, faculty, classrooms]);

    const addCourse = () => setCourses([...courses, { id: `c${Date.now()}`, name: '', code: '', department: '', studentGroup: '', requiredEquipment: [] }]);
    const addFaculty = () => setFaculty([...faculty, { id: `f${Date.now()}`, name: '', department: '', availability: [] }]);
    const addClassroom = () => setClassrooms([...classrooms, { id: `r${Date.now()}`, name: '', capacity: 0, availableEquipment: [] }]);
    
    const removeCourse = (id: string) => setCourses(courses.filter(c => c.id !== id));
    const removeFaculty = (id: string) => setFaculty(faculty.filter(f => f.id !== id));
    const removeClassroom = (id: string) => setClassrooms(classrooms.filter(c => c.id !== id));

    return (
        <div className="min-h-screen bg-gray-100">
            <Header userEmail={userEmail} onLogout={onLogout} role="Authority" />
            <main className="p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Scheduling Inputs</h2>
                        
                        <Accordion title="Courses" icon={<AcademicCapIcon className="h-6 w-6 text-primary-600"/>}>
                           {courses.map((course, index) => (
                                <div key={course.id} className="p-3 mb-2 border rounded-md relative">
                                    <input value={course.name} onChange={e => { const newCourses = [...courses]; newCourses[index].name = e.target.value; setCourses(newCourses); }} placeholder="Course Name" className="w-full mb-2 p-2 border rounded"/>
                                    <input value={course.code} onChange={e => { const newCourses = [...courses]; newCourses[index].code = e.target.value; setCourses(newCourses); }} placeholder="Course Code" className="w-full mb-2 p-2 border rounded"/>
                                    <button onClick={() => removeCourse(course.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                           ))}
                           <button onClick={addCourse} className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-800 mt-2"><PlusIcon className="h-5 w-5"/> Add Course</button>
                        </Accordion>

                        <Accordion title="Faculty" icon={<UsersIcon className="h-6 w-6 text-primary-600"/>}>
                           {faculty.map((f, index) => (
                                <div key={f.id} className="p-3 mb-2 border rounded-md relative">
                                    <input value={f.name} onChange={e => { const newFaculty = [...faculty]; newFaculty[index].name = e.target.value; setFaculty(newFaculty); }} placeholder="Faculty Name" className="w-full mb-2 p-2 border rounded"/>
                                    <button onClick={() => removeFaculty(f.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                           ))}
                           <button onClick={addFaculty} className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-800 mt-2"><PlusIcon className="h-5 w-5"/> Add Faculty</button>
                        </Accordion>
                        
                        <Accordion title="Classrooms" icon={<BuildingOfficeIcon className="h-6 w-6 text-primary-600"/>}>
                           {classrooms.map((c, index) => (
                                <div key={c.id} className="p-3 mb-2 border rounded-md relative">
                                    <input value={c.name} onChange={e => { const newClassrooms = [...classrooms]; newClassrooms[index].name = e.target.value; setClassrooms(newClassrooms); }} placeholder="Classroom Name" className="w-full mb-2 p-2 border rounded"/>
                                    <button onClick={() => removeClassroom(c.id)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                           ))}
                           <button onClick={addClassroom} className="flex items-center gap-2 text-primary-600 font-semibold hover:text-primary-800 mt-2"><PlusIcon className="h-5 w-5"/> Add Classroom</button>
                        </Accordion>

                        <button onClick={handleGenerate} disabled={isLoading} className="w-full mt-4 bg-primary-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-700 transition duration-300 flex items-center justify-center gap-3 disabled:bg-primary-300">
                           {isLoading ? <Spinner /> : <SparklesIcon className="h-5 w-5" />}
                           {isLoading ? 'Generating...' : 'Generate Timetable with AI'}
                        </button>
                    </div>

                    <div className="lg:col-span-2">
                         <h2 className="text-2xl font-bold text-gray-800 mb-4">Generated Timetable</h2>
                         <div className="bg-white rounded-lg shadow p-4 min-h-[60vh]">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <Spinner size="lg"/>
                                    <p className="text-primary-700 font-semibold mt-4 text-lg">{loadingMessage}</p>
                                    <p className="text-gray-500 mt-2">AI is processing your request. This may take a moment.</p>
                                </div>
                            )}
                            {error && <div className="text-red-600 bg-red-100 p-4 rounded-md">{error}</div>}
                            {timetable && !isLoading && <TimetableView timetable={timetable} days={daysOfWeek} timeSlots={timeSlots} />}
                            {!timetable && !isLoading && !error && (
                                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                                    <CalendarIcon className="h-16 w-16 text-gray-300 mb-4"/>
                                    <p className="font-semibold">Your timetable will appear here.</p>
                                    <p>Configure your inputs on the left and click "Generate Timetable".</p>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

// Minimal CalendarIcon for the empty state, to avoid circular deps
const CalendarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M-4.5 12h22.5" />
    </svg>
);


export default AuthorityDashboard;
