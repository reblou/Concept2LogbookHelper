import moment from 'moment';
import { useContext } from 'react';
import externalLinkImage from '/assets/external-link.svg';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function Result({ date, type_pretty, type, distance, time, pace, spm, calories, avg_hr, link }) {

    const filterResultsCallback = useContext(FilterCallbackContext);

  return (
      <tr>
          <td>{moment(date).format('YYYY-MM-DD HH:mm')}</td>
          <td><div className={'workout_type'} style={{background: "var(--typeColour-" + type + ")" }} onClick={() => filterResultsCallback(r => r.pretty_workout_type, v => v===type_pretty, "Type") }>{type_pretty}</div></td>
          <td>{time}</td>
          <td>{distance}m</td>
          <td>{pace}</td>
          <td>{spm}</td>
          <td>{calories}</td>
          <td>{avg_hr === undefined || avg_hr === 0 ? 'N/A' : avg_hr}</td>
          <td><a className={'logbookResultLink'} href={link} target='_blank'>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="external-link">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
              </a> </td>
      </tr>
    );
}

export default Result;