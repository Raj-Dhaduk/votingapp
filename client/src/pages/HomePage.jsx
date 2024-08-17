import React, { useEffect, useState } from "react";
import api from "../services/api";
import CandidateList from "./CandidateList";
import "./../css/HomePage.css";

function HomePage() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get("/candidate");
        setCandidates(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <div>
      <h1>Vote for Your Candidate</h1>
      <CandidateList candidates={candidates} />
    </div>
  );
}

export default HomePage;
