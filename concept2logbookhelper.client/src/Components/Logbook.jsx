import { useSearchParams } from 'react-router-dom';

function Logbook() {
    const [searchParams, setSearchParams] = useSearchParams();

    const authCode = searchParams.get("code");

  return (
      <p>{authCode}</p>
  );
}

export default Logbook;