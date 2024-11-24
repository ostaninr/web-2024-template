import { useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import styled from "styled-components";
import {
  Typography,
  Button,
  Grid,
  Paper,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import PersonIcon from '@mui/icons-material/Person';

interface Booking {
  id: number;
  day: string;
  time: string;
  comment: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  preferences: string;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const AppContainer = styled.div`
  display: flex;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;
  margin-left: 240px;
`;

const DrawerContent = styled.div`
  width: 240px;
`;

const TimeSlot = styled(Paper)<{ isBooked?: boolean }>`
  && {
    padding: 0.5rem;
    text-align: center;
    cursor: pointer;
    background-color: ${props => props.isBooked ? '#1a237e' : '#424242'};
    &:hover {
      background-color: ${props => props.isBooked ? '#1a237e' : '#616161'};
    }
    min-height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }
`;

const CompactTypography = styled(Typography)`
  && {
    font-size: 0.875rem;
  }
`;

const CalendarContainer = styled(Paper)`
  && {
    padding: 1rem;
    overflow-x: auto;
  }
`;

const BookingCard = styled(Paper)`
  && {
    padding: 1rem;
    margin-bottom: 1rem;
  }
`;

function App() {
  const [bookings, setBookings] = useLocalStorageState<Booking[]>("bookings", {
    defaultValue: [],
  });
  const [userProfile, setUserProfile] = useLocalStorageState<UserProfile>("userProfile", {
    defaultValue: {
      name: "",
      email: "",
      phone: "",
      preferences: "",
    },
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [comment, setComment] = useState("");
  const [currentPage, setCurrentPage] = useState<'calendar' | 'bookings' | 'profile'>('calendar');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = Array.from({ length: 15 }, (_, i) => `${i + 8}:00`);

  const handleSlotClick = (day: string, time: string) => {
    const isBooked = bookings.some(booking => booking.day === day && booking.time === time);
    if (!isBooked) {
      setSelectedDay(day);
      setSelectedTime(time);
      setComment("");
      setIsDialogOpen(true);
    }
  };

  const handleBooking = () => {
    if (selectedDay && selectedTime) {
      setBookings([
        ...bookings,
        {
          id: Date.now(),
          day: selectedDay,
          time: selectedTime,
          comment,
        },
      ]);
      setIsDialogOpen(false);
    }
  };

  const isSlotBooked = (day: string, time: string) => {
    return bookings.some(booking => booking.day === day && booking.time === time);
  };

  const renderCalendarPage = () => (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Calendar Booking
      </Typography>
      
      <CalendarContainer>
        <Grid container spacing={1}>
          <Grid item xs={1}>
            <CompactTypography variant="subtitle2" align="center">Time</CompactTypography>
          </Grid>
          {days.map(day => (
            <Grid item xs={2.2} key={day}>
              <CompactTypography variant="subtitle2" align="center" sx={{ fontWeight: 'bold' }}>
                {day}
              </CompactTypography>
            </Grid>
          ))}
        </Grid>

        {times.map(time => (
          <Grid container spacing={1} key={time} sx={{ mt: 0.5 }}>
            <Grid item xs={1}>
              <CompactTypography align="center" sx={{ fontSize: '0.875rem' }}>
                {time}
              </CompactTypography>
            </Grid>
            {days.map(day => (
              <Grid item xs={2.2} key={`${day}-${time}`}>
                <TimeSlot 
                  isBooked={isSlotBooked(day, time)}
                  onClick={() => handleSlotClick(day, time)}
                >
                  {isSlotBooked(day, time) ? 'Booked' : 'Available'}
                </TimeSlot>
              </Grid>
            ))}
          </Grid>
        ))}
      </CalendarContainer>
    </>
  );

  const renderBookingsPage = () => (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
        <Typography variant="body1">No bookings yet</Typography>
      ) : (
        bookings.map(booking => (
          <BookingCard key={booking.id}>
            <Typography variant="h6">
              {booking.day} at {booking.time}
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
              {booking.comment || 'No comment'}
            </Typography>
            <Button 
              color="error" 
              onClick={() => setBookings(bookings.filter(b => b.id !== booking.id))}
              sx={{ mt: 2 }}
            >
              Cancel Booking
            </Button>
          </BookingCard>
        ))
      )}
    </>
  );

  const renderProfilePage = () => (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>
      <Paper sx={{ p: 3, maxWidth: 600 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              value={userProfile.name}
              onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone"
              value={userProfile.phone}
              onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Booking Preferences"
              multiline
              rows={4}
              value={userProfile.preferences}
              onChange={(e) => setUserProfile({ ...userProfile, preferences: e.target.value })}
              variant="outlined"
              helperText="Enter any special requirements or preferences for your bookings"
            />
          </Grid>
          <Grid item xs={12}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => alert('Profile updated!')}
              fullWidth
            >
              Save Changes
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppContainer>
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <DrawerContent>
            <List>
              <ListItem 
                button 
                onClick={() => setCurrentPage('calendar')}
                selected={currentPage === 'calendar'}
              >
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Calendar" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => setCurrentPage('bookings')}
                selected={currentPage === 'bookings'}
              >
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="My Bookings" />
              </ListItem>
              <ListItem 
                button 
                onClick={() => setCurrentPage('profile')}
                selected={currentPage === 'profile'}
              >
                <ListItemIcon>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </List>
          </DrawerContent>
        </Drawer>

        <MainContent>
          {currentPage === 'calendar' ? renderCalendarPage() 
            : currentPage === 'bookings' ? renderBookingsPage()
            : renderProfilePage()}
        </MainContent>

        <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <DialogTitle>Book Time Slot</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  {selectedDay} at {selectedTime}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleBooking} variant="contained" color="primary">
              Book
            </Button>
          </DialogActions>
        </Dialog>
      </AppContainer>
    </ThemeProvider>
  );
}

export default App;
