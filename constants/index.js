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



  로그인 버튼 -> GoogleSigninButton -> response -> token -> <Calendar accessToken={accessToken} /> -> fetchCalendarEvents -> event

  onclick -> {    response에서 토큰을 받아서 session에 저장  } -> getSession으로 token을 받아서 calendar에 입력 -> 


                      user.action.ts                                calendar.tsx