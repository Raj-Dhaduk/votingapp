import React from "react";
import VoteButton from "./VoteButton";
import "./../css/CandidateList.css";

function CandidateList({ candidates }) {
  return (
    <div>
      {candidates.map((candidate) => (
        <div key={candidate._id}>
          <h3>{candidate.name}</h3>
          <p>Party: {candidate.party}</p>

          <VoteButton candidateId={candidate._id} />
        </div>
      ))}
    </div>
  );
}

export default CandidateList;
