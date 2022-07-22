import {useState} from "react";

export default function useVisualMode(initial) {

  // const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);


  function transition(changeMode, replace = false) {
    setHistory(prev => {
      if (replace) {
        return [changeMode, ...prev.slice(1)];
      } else {
        return [changeMode, ...prev];
      }
    });
  }
  

  function back() {
    setHistory(prev => {
      if (prev.length > 1) {
        return prev.slice(1);
      } else {
        return prev;
      }
    });
  }

  return { mode: history[0], transition, back };
}