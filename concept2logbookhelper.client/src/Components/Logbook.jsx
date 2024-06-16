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
        var response = await fetch("api/logbook/getresults")
        var data = await response.json();
    }
}

export default Logbook;