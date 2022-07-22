// The state object will maintain the same structure.
// The setDay action can be used to set the current day.
// The bookInterview action makes an HTTP request and updates the local state.
// The cancelInterview action makes an HTTP request and updates the local state.

import { useState, useEffect } from "react";

import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState({ ...state, day });
  //I thought we wanted to avoid this
  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    // const days = [...state.days];
    const days = state.days.map(day => {
      if (day.appointments.includes(id)) {
        return {...day,spots:day.spots - 1};
      }
      return day;
    });

    return axios.put(`/api/appointments/${id}`, appointment)
      .then(() => setState((state) => {
        return {...state, appointments, days};
      }));
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    // const days = [...state.days];
    const days = state.days.map(day => {
      if (day.appointments.includes(id)) {
        const newday = {...day,spots:day.spots + 1};
        return newday;
        // return {...day,spots:day.spots++}
      }
      return day;
    });
    
    return axios.delete(`/api/appointments/${id}`)
      .then(() => {
        setState((state) => {
          return {...state, appointments, days};
        });
      });
  }

  useEffect(() => {
    
    Promise.all(
      [
        axios.get("/api/days"),
        axios.get("/api/appointments"),
        axios.get("/api/interviewers")
      ]
    )
      .then((all) => {
        setState(prev => ({
          ...prev,
          days: all[0].data,
          appointments: all[1].data,
          interviewers: all[2].data
        })
        );
      });
  }, []);

  return {state, setDay, bookInterview,cancelInterview};
}