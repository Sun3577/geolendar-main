const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const SCOPES = "https://www.googleapis.com/auth/calendar.events.readonly";



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