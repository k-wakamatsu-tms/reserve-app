'use client';
import React, { useState ,RefObject} from 'react';
import { Box, Grid, IconButton, Paper, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { format, addDays, subDays, setMinutes, setHours } from 'date-fns';
import { ja } from 'date-fns/locale';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TodayIcon from '@mui/icons-material/Today';
import { jaJP } from '@mui/x-date-pickers/locales';

interface SchedulerProps {
  startHour: number;
  endHour: number;
  selectedShop: number | null;
  reservations: { day: number; hour: number; count: number }[];
}

const mockReservations = [
    { day: 1, hour: 10, count: 2 },
    { day: 1, hour: 14, count: 1 },
    { day: 3, hour: 16, count: 3 },
  ];

  const CELL_HEIGHT = 60; 

const Scheduler: React.FC<SchedulerProps> = ({ startHour, endHour, selectedShop, reservations  }) => {
  const [selectedCell, setSelectedCell] = useState<{ day: number; hour: number } | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(setMinutes(setHours(new Date(), startHour), 0));

  const handleCellClick = (day: number, hour: number, count: number) => {
    if (count === 0) return;
    setSelectedCell({ day, hour });
  };

  const renderTimeSlots = () => {
    const timeSlots = [];
    for (let hour = startHour; hour < endHour; hour++) {
        timeSlots.push(
            <Grid item key={hour} sx={{ height: CELL_HEIGHT, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" align="right" sx={{ mr: 1 }}>
                {`${hour}:00`}
              </Typography>
            </Grid>
          );
    }
    return timeSlots;
  };

  const renderDayCells = (day: number) => {
    const dayCells = [];
    for (let hour = startHour; hour < endHour; hour++) {
      const isSelected = selectedCell?.day === day && selectedCell?.hour === hour;
      const reservation = reservations.find((res) => res.day === day && res.hour === hour);
      const count = reservation ? reservation.count : 0;

      dayCells.push(
        <Grid item key={`${day}-${hour}`} sx={{ position: 'relative', borderBottom: '1px solid', borderColor: 'divider', height: CELL_HEIGHT }}>
          <Box
            onClick={() => handleCellClick(day, hour, count)}
            sx={{
              height: '100%',
              backgroundColor: count === 0 ? 'grey.200' : isSelected ? 'primary.main' : 'grey.100',
              cursor: count === 0 ? 'default' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color={count === 0 ? 'text.disabled' : 'text.primary'}>
              {`残り: ${count}`}
            </Typography>
          </Box>
        </Grid>
      );
    }
    return dayCells;
    };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setCurrentDate(setMinutes(setHours(date, startHour), 0));
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate((prevDate) => subDays(prevDate, 1));
  };

  const goToNextDay = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 1));
  };

  const goToToday = () => {
    setCurrentDate(setMinutes(setHours(new Date(), startHour), 0));
  }; 

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} localeText={jaJP.components.MuiLocalizationProvider.defaultProps.localeText}>
    <Box>
      <Grid container alignItems="center" sx={{ mb: 2 }}>
        <Grid item>
          <DatePicker
            value={currentDate}
            onChange={handleDateChange}
            // renderInput={({ inputRef, inputProps, InputProps }) => (
            //   <Box sx={{ display: 'flex', alignItems: 'center' }}>
            //     <input ref={inputRef as RefObject<HTMLInputElement>} {...inputProps} />
            //     {InputProps?.endAdornment}
            //   </Box>
            // )}
          />
        </Grid>
        <Grid item>
          <IconButton onClick={goToPreviousDay}>
            <NavigateBeforeIcon />
          </IconButton>
          <IconButton onClick={goToToday}>
            <TodayIcon />
          </IconButton>
          <IconButton onClick={goToNextDay}>
            <NavigateNextIcon />
          </IconButton>
        </Grid>
      </Grid>
      <Box sx={{ height: 600, overflow: 'auto' }}>
        <Grid container>
          <Grid item>
            <Grid container direction="column">
                <Grid item sx={{ height: CELL_HEIGHT, borderBottom: '1px solid', borderColor: 'divider' }} />
              {renderTimeSlots()}
            </Grid>
          </Grid>
          {[0,1, 2, 3, 4, 5, 6].map((day) => (
            <Grid item key={day} xs>
              <Grid container direction="column">
                <Grid item sx={{ height: CELL_HEIGHT , borderBottom: '1px solid', borderColor: 'divider'}}>
                <Typography align="center" variant="body1">
                    {format(addDays(currentDate, day), 'E', { locale: ja })}
                </Typography>
                <Typography align="center" variant="body2">
                    {format(addDays(currentDate, day), 'd', { locale: ja })}
                </Typography>
                </Grid>
                {renderDayCells((day + currentDate.getDay()) % 7)}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  </LocalizationProvider>
  );
};

export default Scheduler;