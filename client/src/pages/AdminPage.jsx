import React, { useState, useEffect } from "react";
import api from "../services/api.jsx";
import "./../css/AdminPage.css";

function AdminPage() {
  const [candidates, setCandidates] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    party: "",
    age: "",
  });

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

  const handleAddCandidate = async () => {
    try {
      await api.post("/candidate", newCandidate);
      setCandidates([...candidates, newCandidate]);
      setNewCandidate({ name: "", party: "", age: "" });
    } catch (error) {
      console.error(error);
      alert("Adding candidate failed.");
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Add Candidate</h2>
      <input
        type="text"
        placeholder="Name"
        value={newCandidate.name}
        onChange={(e) =>
          setNewCandidate({ ...newCandidate, name: e.target.value })
        }
      />
      <input
        type="text"
        placeholder="Party"
        value={newCandidate.party}
        onChange={(e) =>
          setNewCandidate({ ...newCandidate, party: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Age"
        value={newCandidate.age}
        onChange={(e) =>
          setNewCandidate({ ...newCandidate, age: Number(e.target.value) })
        }
      />
      <button onClick={handleAddCandidate}>Add Candidate</button>
      <h2>Manage Candidates</h2>
      <ul>
        {candidates.map((candidate) => (
          <li key={candidate._id}>
            {candidate.name} - {candidate.party}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
