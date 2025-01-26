import "../css/Loading.css";

function Loading() {
  return (
    <div className="loading">
		<p>Fetching Results... </p>
		<div className='spinner'/>
	</div>
  );
}

export default Loading;