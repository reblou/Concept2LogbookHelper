import moment from 'moment';

function Result(props) {
  return (
      <tr>
          <td>{moment(props.date).format('YYYY-MM-DD HH:mm')}</td>
          <td>{props.type}</td>
          <td>{props.distance}m</td>
          <td>{props.time}</td>
          <td>{props.pace}</td>
          <td>N/A</td>
      </tr>
  );
}

export default Result;