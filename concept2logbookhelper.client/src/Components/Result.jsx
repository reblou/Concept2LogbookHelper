import moment from 'moment';

function Result({date, type, distance, time, pace, spm, calories, tag_colour }) {
  return (
      <tr>
          <td>{moment(date).format('YYYY-MM-DD HH:mm')}</td>
          <td><div className={'workout_type'} style={{ background: tag_colour } }>{type}</div></td>
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