import React from "react";
import DayListItem from "./DayListItem"

export default function DayList(props) {
  const dayListItems = props.days.map(day => {
    return (
    <DayListItem 
      key={day.id} 
      name={day.name}
      spots={day.spots}
      setDay={() => props.onChange(day.name)}
      selected={day.name === props.value}/>
    )
  });
  return (
    <ul>
      {dayListItems}
    </ul>
  )
};