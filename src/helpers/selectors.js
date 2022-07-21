export function getAppointmentsForDay(state, day) {
  const filteredAppointments = state.days.filter(dayObj => dayObj.name === day);
  if (!state.days || filteredAppointments.length === 0 ) {return []};
  return filteredAppointments[0].appointments.map(appointment => { return state.appointments[appointment] });
};

export function getInterview(state, interview) {
  if (interview === null) return null;
  
  const interviewer = Object.values(state.interviewers).filter(interviewerObj => interviewerObj["id"] === interview.interviewer);
  return {...interview, interviewer: interviewer[0]}
}

export function getInterviewersForDay(state, day) {
  const filteredInterviewers = state.days.filter(dayObj => dayObj.name === day);
  if (!state.days || filteredInterviewers.length === 0 ) {return []};
  return filteredInterviewers[0].interviewers.map(interviewer => { return state.interviewers[interviewer] });
};

