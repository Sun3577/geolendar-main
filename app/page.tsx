"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useEffect, useState } from "react";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import { DeleteModal } from "@/components/DeleteModal";
import { EventModal } from "@/components/EventModal";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";

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

interface CalendarEventsResponse {
  result: {
    items: CalendarEvent[];
  };
}

export default function Home() {
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
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
        callback: handleCredentialResponse,
      });
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
    };
    document.body.appendChild(script);
  }, []);

  const handleCredentialResponse = async (response: any) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID!,
      scope: SCOPES,
      callback: (tokenResponse: any) => {
        if (tokenResponse.access_token) {
          setIsSignedIn(true);
          listUpcomingEvents(tokenResponse.access_token);
        }
      },
    });

    client.requestAccessToken();
  };

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

  const handleAuthClick = () => {
    google.accounts.id.prompt(); // Shows the One Tap prompt
  };

  const listUpcomingEvents = async (accessToken: string) => {
    try {
      const response = (await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
        oauth_token: accessToken,
      })) as CalendarEventsResponse;

      const events = response.result.items.map(({ summary, id, start }) => ({
        title: summary,
        id,
        start: start.dateTime || start.date,
        allDay: !start.dateTime,
      }));

      setAllEvents(events);
      console.log(allEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  return (
    <>
      <nav className="flex justify-between mb-12 border-b border-violet-100 p-4">
        <h1 className="font-bold text-2xl text-gray-700">Calendar</h1>
        <button
          onClick={handleAuthClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isSignedIn
            ? "Disconnect Google Calendar"
            : "Connect Google Calendar"}
        </button>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div id="signInDiv"></div>
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
      </main>
    </>
  );
}
