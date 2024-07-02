import moment from 'moment';

function Result({date, type_pretty, type, distance, time, pace, spm, calories, avg_hr}) {
  return (
      <tr>
          <td>{moment(date).format('YYYY-MM-DD HH:mm')}</td>
          <td><div className={'workout_type ' + type}>{type_pretty}</div></td>
          <td>{time}</td>
          <td>{distance}m</td>
          <td>{pace}</td>
          <td>{spm}</td>
          <td>{calories}</td>
          <td>{avg_hr === undefined || avg_hr === 0 ? 'N/A' : avg_hr}</td>
      </tr>
    );
}

export default Result;