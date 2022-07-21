import React, {useState, useEffect} from "react";
import axios from 'axios';

import { getAppointmentsForDay, getInterview, getInterviewersForDay} from "helpers/selectors";

export default function useApplicationData() {
  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [], 
    appointments: {},
    interviewers: null
  })

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('api/interviewers')
    ]).then((response) => {
      setState(prev => ({...prev, days: response[0].data, appointments: response[1].data, interviewers: response[2].data}));
    });
  }, [])

  function spotsRemaining() {
    const getDay = state.days.filter(day => day.name === state.day)[0].id;
    let spotsRemaining = 0;
    const appointments = getAppointmentsForDay(state, state.day)
    appointments.map(appointment => {
      if (appointment.interview) spotsRemaining++; 
    });
    return {spotsRemaining, getDay};
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${id}`, {interview})
      .then((res) => {setState({...state, appointments})})
      .then(res => {
        axios.put(`api/days/`, {spots: spotsRemaining()})
      })
  }

  function cancelInterview(id) {
    return axios.delete(`api/appointments/${id}`)
      .then(() => {
        axios.put(`api/days/`, {spots: spotsRemaining()})
      })
  }

  return {state, setDay, bookInterview, cancelInterview}
}