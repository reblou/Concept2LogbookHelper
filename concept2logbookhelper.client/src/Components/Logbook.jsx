import { useSearchParams } from 'react-router-dom';

function Logbook() {
    const [searchParams, setSearchParams] = useSearchParams();

    const authCode = searchParams.get("code");

  return (
      <h1>LogBook goes here</h1>
  );
}

export default Logbook;