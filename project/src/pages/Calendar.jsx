import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { format } from 'date-fns';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  AlignLeft, 
  Tag,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarLucide,
  Grid,
  List,
  LayoutGrid
} from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const priorityColors = {
  low: '#22c55e',    // green-500
  medium: '#eab308', // yellow-500
  high: '#ef4444'    // red-500
};

const ViewButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-purple-500/30 text-purple-300'
        : 'bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

function Calendar() {
  const { isDark } = useTheme();
  const { addNotification } = useNotification();
  const [tasks, setTasks] = useState([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentView, setCurrentView] = useState('timeGridWeek');
  const calendarRef = React.useRef(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        start: task.deadline,
        end: task.deadline,
        backgroundColor: priorityColors[task.priority || 'medium'],
        borderColor: priorityColors[task.priority || 'medium'],
        textColor: '#ffffff',
        extendedProps: {
          description: task.description,
          priority: task.priority,
          category: task.category,
          status: task.status
        }
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      addNotification('Failed to load tasks', 'error');
    }
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

    setSelectedEvent({
      start: selectInfo.start,
      end: selectInfo.end,
      allDay: selectInfo.allDay
    });
    setShowEventModal(true);
  };

  const handleEventDrop = async (info) => {
    try {
      const { event } = info;
      const { error } = await supabase
        .from('tasks')
        .update({
          deadline: event.start,
          updated_at: new Date().toISOString()
        })
        .eq('id', event.id);

      if (error) throw error;
      addNotification('Event updated successfully', 'success');
    } catch (error) {
      console.error('Error updating event:', error);
      addNotification('Failed to update event', 'error');
      info.revert();
    }
  };

  const handleViewChange = (newView) => {
    setCurrentView(newView);
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(newView);
  };

  const handleToday = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.today();
  };

  const handlePrev = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.prev();
  };

  const handleNext = () => {
    const calendarApi = calendarRef.current.getApi();
    calendarApi.next();
  };

  return (
    <div className="min-h-screen p-6 relative" style={{
      backgroundImage: "url('https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1920')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat'
    }}>
      <div className="absolute inset-0 bg-black/25 dark:bg-black/60" />

      <div className="relative z-10 max-w-[1600px] mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Time Matrix
            </h1>
            <button
              onClick={handleToday}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Today
            </button>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg bg-black/30 text-gray-400 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            <ViewButton
              icon={Grid}
              label="Month"
              isActive={currentView === 'dayGridMonth'}
              onClick={() => handleViewChange('dayGridMonth')}
            />
            <ViewButton
              icon={LayoutGrid}
              label="Week"
              isActive={currentView === 'timeGridWeek'}
              onClick={() => handleViewChange('timeGridWeek')}
            />
            <ViewButton
              icon={CalendarLucide}
              label="Day"
              isActive={currentView === 'timeGridDay'}
              onClick={() => handleViewChange('timeGridDay')}
            />
            <ViewButton
              icon={List}
              label="List"
              isActive={currentView === 'listWeek'}
              onClick={() => handleViewChange('listWeek')}
            />
          </div>
        </div>

        <div className="bg-black/30 backdrop-blur-md border border-purple-500/20 rounded-xl overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={false}
            events={tasks}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            expandRows={true}
            height="auto"
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            eventClick={handleEventClick}
            select={handleDateSelect}
            eventDrop={handleEventDrop}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }}
            nowIndicator={true}
            scrollTimeReset={false}
            className={isDark ? 'fc-dark' : 'fc-light'}
          />
        </div>
      </div>
    </div>
  );
}

export default Calendar;