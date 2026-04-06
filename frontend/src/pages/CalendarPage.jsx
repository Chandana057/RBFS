import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight, File } from "lucide-react";
import { fileService } from "../services/fileService";
import { useAuth } from "../context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export const CalendarPage = () => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [files, setFiles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const data = await fileService.getFiles(user.role, user.id);
      setFiles(data);
    };
    fetchFiles();
  }, [user]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfMonth(monthStart); // Normally would pad to start of week, but keeping it simple for the grid
  
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const filesOnDate = (date) => files.filter(f => isSameDay(new Date(f.uploadDate), date));
  const selectedFiles = selectedDate ? filesOnDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-manrope font-bold text-on-surface">Upload Calendar</h1>
        <p className="text-on-surface-variant">View your asset uploads organized by date.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{format(currentDate, "MMMM yyyy")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={prevMonth}><ChevronLeft className="w-5 h-5"/></Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}><ChevronRight className="w-5 h-5"/></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-on-surface-variant">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {/* Padding offset */}
              {Array.from({ length: monthStart.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="h-24 rounded-lg bg-surface-container-lowest/50" />
              ))}
              
              {days.map((day, i) => {
                const dayFiles = filesOnDate(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                
                return (
                  <div 
                    key={day.toString()}
                    onClick={() => setSelectedDate(day)}
                    className={`h-24 p-2 rounded-lg border ghost-border cursor-pointer transition-colors ${
                      isSelected ? "bg-primary/20 border-primary" : "hover:bg-surface-variant"
                    }`}
                  >
                    <div className="text-right text-sm text-on-surface-variant">{format(day, "d")}</div>
                    {dayFiles.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        <div className="px-2 py-1 text-[10px] rounded bg-primary/20 text-primary w-full truncate">
                          {dayFiles.length} file{dayFiles.length > 1 ? 's' : ''}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedDate ? format(selectedDate, "MMMM do, yyyy") : "Select a date"}</CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedDate ? (
              <p className="text-on-surface-variant text-center py-10">Click any date on the calendar to see files uploaded on that day.</p>
            ) : selectedFiles.length === 0 ? (
              <p className="text-on-surface-variant text-center py-10">No files uploaded on this date.</p>
            ) : (
              <div className="space-y-4">
                {selectedFiles.map(f => (
                  <div key={f.id} className="p-3 bg-surface-container rounded-lg border ghost-border flex items-center gap-3 cursor-pointer hover:bg-surface-variant transition-colors">
                    <File className="w-8 h-8 text-secondary" />
                    <div>
                      <p className="font-medium text-sm text-on-surface truncate max-w-[150px]">{f.name}</p>
                      <p className="text-xs text-on-surface-variant">{(f.size / 1024).toFixed(1)} KB • {f.permissions}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
