
import React from 'react';
import type { Timetable, ScheduleEntry } from '../types';

interface TimetableViewProps {
  timetable: Timetable | null;
  days: string[];
  timeSlots: string[];
}

const getColorForCourse = (courseCode: string) => {
    let hash = 0;
    for (let i = 0; i < courseCode.length; i++) {
        hash = courseCode.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
        'bg-blue-100 border-blue-400 text-blue-800',
        'bg-green-100 border-green-400 text-green-800',
        'bg-yellow-100 border-yellow-400 text-yellow-800',
        'bg-purple-100 border-purple-400 text-purple-800',
        'bg-pink-100 border-pink-400 text-pink-800',
        'bg-indigo-100 border-indigo-400 text-indigo-800',
        'bg-red-100 border-red-400 text-red-800',
    ];
    return colors[Math.abs(hash) % colors.length];
};


const TimetableView: React.FC<TimetableViewProps> = ({ timetable, days, timeSlots }) => {
  if (!timetable) {
    return <div className="text-center p-8">No timetable data available.</div>;
  }

  const findEntry = (day: string, timeSlot: string): ScheduleEntry | undefined => {
    const dayKey = day.toLowerCase() as keyof Timetable;
    return timetable[dayKey]?.find(entry => entry.timeSlot === timeSlot);
  };

  return (
    <div className="overflow-x-auto">
      <div className="grid grid-cols-[auto_repeat(5,minmax(150px,1fr))] gap-1">
        {/* Time slot headers */}
        <div className="sticky left-0 bg-white z-10"></div>
        {days.map(day => (
          <div key={day} className="text-center font-bold p-2 text-gray-700 bg-gray-100 rounded-t-lg">{day}</div>
        ))}
        
        {/* Timetable body */}
        {timeSlots.map(slot => (
          <React.Fragment key={slot}>
            <div className="font-semibold p-2 text-right text-xs text-gray-500 sticky left-0 bg-white z-10">{slot}</div>
            {days.map(day => {
              const entry = findEntry(day, slot);
              return (
                <div key={`${day}-${slot}`} className="border border-gray-200 min-h-[120px] bg-gray-50 p-1">
                  {entry && (
                    <div className={`h-full w-full rounded-md p-2 flex flex-col justify-between text-xs shadow-sm border-l-4 ${getColorForCourse(entry.courseCode)}`}>
                      <div>
                        <p className="font-bold">{entry.courseCode}</p>
                        <p className="font-medium">{entry.courseName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">{entry.facultyName}</p>
                        <p className="text-gray-600 font-semibold">{entry.classroomName}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TimetableView;
