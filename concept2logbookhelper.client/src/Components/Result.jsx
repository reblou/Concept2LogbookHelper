import moment from 'moment';
import { useContext } from 'react';
import { FilterCallbackContext } from '../Contexts/FilterCallbackContext';

function Result({ date, type_pretty, type, distance, time, pace, spm, calories, avg_hr, link }) {

    const filterResultsCallback = useContext(FilterCallbackContext);

  return (
      <tr>
          <td>{moment(date).format('YYYY-MM-DD HH:mm')}</td>
          <td><div className={'workout_type ' + type} onClick={() => filterResultsCallback(r => r.pretty_workout_type, v => v===type_pretty, "Type") }>{type_pretty}</div></td>
          <td>{time}</td>
          <td>{distance}m</td>
          <td>{pace}</td>
          <td>{spm}</td>
          <td>{calories}</td>
          <td>{avg_hr === undefined || avg_hr === 0 ? 'N/A' : avg_hr}</td>
          <td><a className={'logbookResultLink'} href={link} target='_blank'>
              <img className={'logbookResultLinkImg'} src='src\assets\external-link.svg' />
              </a> </td>
      </tr>
    );
}

export default Result;