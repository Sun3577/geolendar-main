"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useState } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { DeleteModal } from "@/components/DeleteModal";
import { EventModal } from "@/components/EventModal";

interface Event {
  title: string;
  start: string | Date | undefined;
  allDay: boolean;
  id: string;
}

interface CalendarEvent {
  summary: string;
  id: string;
  start: {
    dateTime?: string;
    date?: string;
  };
}

// client component

const Calendar = ({ accessToken }: any) => {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: "",
  });

  // useEffect(() => {
  //   if (accessToken) {
  //     fetchCalendarEvents(accessToken);
  //   }
  // }, [accessToken]);

  // const fetchCalendarEvents = async (accessToken: string) => {
  //   try {
  //     const response = await axios.get(
  //       "https://www.googleapis.com/calendar/v3/calendars/primary/events",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       }
  //     );

  //     const events: Event[] = response.data.items.map(
  //       (event: CalendarEvent) => ({
  //         title: event.summary,
  //         start: event.start.dateTime || event.start.date,
  //         allDay: !event.start.dateTime,
  //         id: event.id,
  //       })
  //     );

  //     setAllEvents(events);
  //   } catch (error) {
  //     console.error("Error fetching calendar events", error);
  //   }
  // };

  const addEvent = (data: DropArg) => {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime().toString(),
    };
    setAllEvents([...allEvents, event]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNewEvent({
      ...newEvent,
      title: e.target.value,
    });
  };

  const handleDateClick = (arg: { date: Date; allDay: boolean }) => {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime().toString(),
    });
    setShowModal(true);
  };

  const handleDeleteModal = (data: { event: { id: string } }) => {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  };

  const handleDelete = () => {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: "",
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]); // 전체 이벤트에 저장
    setShowModal(false);
    setNewEvent({
      title: "",
      start: "",
      allDay: false,
      id: "",
    });
  };

  return (
    <>
      <div className="grid grid-cols-10">
        <div className="col-span-8">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "resourceTimelineWook, dayGridMonth,timeGridWeek",
            }}
            events={allEvents as EventSourceInput}
            nowIndicator={true}
            editable={true}
            droppable={true}
            selectable={true}
            selectMirror={true}
            dateClick={handleDateClick}
            drop={(data) => addEvent(data)}
            eventClick={(data) => handleDeleteModal(data)}
          />
        </div>

        <div
          id="draggable-el"
          className="ml-8 w-full border-2 p-2 rounded-md mt-16 lg:h-1/2 bg-violet-50"
        >
          <h1 className="font-bold text-lg text-center">Drag Event</h1>
          {allEvents.map((event) => (
            <div
              className="fc-event border-2 p-1 m-2 w-full rounded-md ml-auto text-center bg-white"
              title={event.title}
              key={event.id}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onDelete={handleDelete}
      />

      <EventModal
        showModal={showModal}
        onClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
        initialEvent={newEvent}
        handleCloseModal={handleCloseModal}
        handleChange={handleChange}
      />
    </>
  );
};

export default Calendar;
