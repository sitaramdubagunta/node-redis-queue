require("dotenv").config();

const express = require("express");
const redis = require("./redis");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is alive ");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const { randomUUID } = require("crypto"); //generates random job id 

app.post("/jobs", async (req, res) => {
  const { type, payload } = req.body;

  if (!type) {
    return res.status(400).json({ error: "Job type is required" }); //malformed server r
  }

  const job = {
    id: randomUUID(),
    type,
    payload: payload || {},
    createdAt: Date.now(),
  };

  // push job into Redis queue , await waits until the promise is returned
  await redis.lpush("job_queue", JSON.stringify(job));

  res.status(201).json({ // http 201 
    jobId: job.id,
    status: "queued",
  });
});
