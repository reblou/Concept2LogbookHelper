function Result(props) {
  return (
      <tr>
          <td>{props.date}</td>
          <td>{props.type}</td>
          <td>{props.desc}</td>
          <td>{props.distance}m</td>
          <td>{props.time}</td>
          <td>{props.pace}</td>
          <td>N/A</td>
      </tr>
  );
}

export default Result;