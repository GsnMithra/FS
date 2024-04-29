const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

mongoose
    .connect(
        "<DBURL>"
    )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

const counterSchema = new mongoose.Schema(
    {
        count: { type: Number, default: 0 },
        myCount: { type: Number, default: 0 },
    },
    { collection: "counters" },
);
const Counter = mongoose.model("Counter", counterSchema);

app.get("/hello/mithra", (req, res) => {
    res.send("Hello, Mithra");
})

app.get("/api/counter", async (req, res) => {
    try {
        const counter = await Counter.findOne();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/counter/increment", async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/counter/decrement", async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.count--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.get("/api/mycounter", async (req, res) => {
    try {
        const counter = await Counter.findOne();
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/mycounter/increment", async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.myCount++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/mycounter/decrement", async (req, res) => {
    try {
        let counter = await Counter.findOne();
        if (!counter) {
            counter = new Counter();
        }
        counter.myCount--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
