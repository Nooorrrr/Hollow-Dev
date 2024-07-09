import React from "react";

const HomePage = (props) => {
    return (
        <div className="hp-container">
            <h1 className="hp-header">You are Connected to Metamask</h1>
            <p className="hp-account">Metamask Account: {props.account}</p>
            <p className="hp-account">Remaining Time: {props.remainingTime}</p>
            { props.showButton ? (
                <p className="hp-account">You have already voted</p>
            ) : (
                <div>
                    <input type="number" placeholder="Entern Candidate Index" value={props.number} onChange={props.handleNumberChange}></input>
            <br />
            <button className="hp-button" onClick={props.voteFunction}>Vote</button>

                </div>
            )}
            
            <table id="myTable" className="candidates-table">
                <thead>
                <tr>
                    <th>Index</th>
                    <th>Candidate name</th>
                    <th>Candidate votes</th>
                </tr>
                </thead>
                <tbody>
                {props.candidates.map((candidate, index) => (
                    <tr key={index}>
                    <td>{candidate.index}</td>
                    <td>{candidate.name}</td>
                    <td>{candidate.voteCount}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            
        </div>
    )
}

export default HomePage;