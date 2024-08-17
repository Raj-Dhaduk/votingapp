// src/components/VoteButton.js
import React, { useState } from "react";
import api from "../services/api";
import "./../css/VoteButton.css";

function VoteButton({ candidateId }) {
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    try {
      await api.post(`/candidate/vote/${candidateId}`);
      setVoted(true);
    } catch (error) {
      console.error("Voting failed:", error);
      alert("Voting failed.");
    }
  };

  return (
    <button onClick={handleVote} disabled={voted}>
      {voted ? "Voted" : "Vote"}
    </button>
  );
}

export default VoteButton;
