import { Routes, Route } from "react-router-dom";
import OrganizerHome from "./pages/organizerhome";
import AddEvent from "./pages/addevent";
import Auth from "./pages/auth";
import EditEvent from "./pages/editevent";
import Attendees from "./pages/attendees";
import EventDetail from "./pages/eventdetail";
import MyTickets from "./pages/mytickets";
import Registration from "./pages/registration";
import EventDetailAttendee from "./pages/eventdetailattendee";
import AttendeeHome from "./pages/attendeehome";



function App() {
  return (
    <Routes>
      <Route path="/" element={<OrganizerHome />} />
      <Route path="/add-event" element={<AddEvent />} />
            <Route path="/attendee-home" element={<AttendeeHome />} />
    <Route path="/event-attendee/:eventId" element={<EventDetailAttendee />} />
<Route path="/edit-event/:eventId" element={<EditEvent />} />
<Route path="/attendees/:eventId" element={<Attendees />} />
  <Route path="/event/:eventId" element={<EventDetail />} />
    <Route path="/my-tickets" element={<MyTickets />} />
<Route path="/register/:eventId" element={<Registration />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
