import { useEffect, useState } from "react";


function Logbook() {
    const [totalResults, setTotalResults] = useState();

    useEffect(() => { populateTotalResults() }, []);

    const total = totalResults === undefined ? "" : totalResults

    return (
      <div>
            <h1>LogBook goes here</h1>
            <p>Total: {total}</p>
      </div>
    );


    async function populateTotalResults() {
        var response = await fetch("api/authentication/totalresults")
        var data = await response.json();
        setTotalResults(data);
    }
}

export default Logbook;