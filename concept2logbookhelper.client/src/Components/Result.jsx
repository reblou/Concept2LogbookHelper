import moment from 'moment';

function Result({date, type_pretty, type, distance, time, pace, spm, calories}) {
  return (
      <tr>
          <td>{moment(date).format('YYYY-MM-DD HH:mm')}</td>
          <td><div className={'workout_type ' + type}>{type_pretty}</div></td>
          <td>{distance}m</td>
          <td>{time}</td>
          <td>{pace}</td>
          <td>{spm}</td>
          <td>{calories}</td>
          <td>N/A</td>
      </tr>
    );


}

export default Result;