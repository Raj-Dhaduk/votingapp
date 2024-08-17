const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware } = require("../jwt");
const Candidate = require("../models/candidate");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
};

// POST route to add a candidate
router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const data = req.body; // Assuming the request body contains the candidate data

    // Create a new Candidate document using the Mongoose model
    const newCandidate = new Candidate(data);

    // Save the new candidate to the database
    const response = await newCandidate.save();
    console.log("Data saved");
    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT route to update a candidate
router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const candidateID = req.params.candidateId; // Use candidateId (correct casing)
    const updatedCandidateData = req.body; // Updated data for the candidate

    const response = await Candidate.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validation
      }
    );

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE route to delete a candidate
router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id)))
      return res.status(403).json({ message: "User does not have admin role" });

    const candidateID = req.params.candidateId; // Use candidateId (correct casing)

    const response = await Candidate.findByIdAndDelete(candidateID);

    if (!response) {
      return res.status(404).json({ error: "Candidate not found" });
    }

    console.log("Candidate deleted");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to vote for a candidate
router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const candidateID = req.params.candidateId; // Use candidateId (correct casing)
  const userId = req.user.id;

  try {
    const candidate = await Candidate.findById(candidateID);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVoted) {
      return res.status(400).json({ message: "You have already voted" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Admin not allowed to vote" });
    }

    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();

    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote successful" });
  } catch (error) {
    console.error("Error voting:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET route to get the vote count
router.get("/vote/count", async (req, res) => {
  try {
    // Find all candidates and sort them by voteCount in descending order
    const candidates = await Candidate.find().sort({ voteCount: "desc" });

    // Map the candidates to only return their party and voteCount
    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });

    return res.status(200).json(voteRecord);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to get a list of all candidates with _id included
router.get("/", async (req, res) => {
  try {
    // Find all candidates and select only the name, party, and _id fields
    const candidates = await Candidate.find({}, "name party _id");

    // Return the list of candidates
    res.status(200).json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
