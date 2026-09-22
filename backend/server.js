const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/test", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW()");

        res.json({
            message: "Database connected successfully!",
            time: result.rows[0].now
        });
    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Database connection failed",
            error: error.message
        });
    }
});

app.get("/api/members", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM team_members ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch team members"
        });
    }
});

app.patch("/api/members/:id/status", async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["Available", "Busy", "Away"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const result = await pool.query(
            `UPDATE team_members
             SET status = $1, updated_at = NOW()
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Team member not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Failed to update status"
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
