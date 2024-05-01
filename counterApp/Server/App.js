import queryString from "query-string";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";
import jwt from "jsonwebtoken";

const app = express();
const PORT = process.env.PORT || 5001;
const config = {
    clientId: process.env.CLIENT_ID,
    projectId: process.env.PROJECT_ID,
    authUrl: process.env.AUTH_URL,
    tokenUrl: process.env.TOKEN_URL,
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    clientSecret: process.env.CLIENT_SECRET,
    redirectUrl: process.env.REDIRECT_URL,
    clientUrl: process.env.CLIENT_URL,
    tokenSecret: process.env.TOKEN_SECRET,
    tokenExpiration: 36000,
};

const authParams = queryString.stringify({
    client_id: config.clientId,
    redirect_uri: config.redirectUrl,
    response_type: "code",
    scope: "openid profile email",
    access_type: "offline",
    state: "standard_oauth",
    prompt: "consent",
});

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Error connecting to MongoDB:", err));

const userCounterSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        count: { type: Number, default: 0 },
        myCount: { type: Number, default: 0 },
    },
    { collection: "users" },
);
const User = mongoose.model("User", userCounterSchema);

const getTokenParams = (code) => {
    return queryString.stringify({
        code,
        client_id: config.clientId,
        grant_type: "authorization_code",
        client_secret: config.clientSecret,
        redirect_uri: config.redirectUrl,
    });
};

app.get("/hello", (_, res) => {
    res.send("Hello from server!");
});

app.post("/user/create", async (req, res) => {
    const { name, email } = req.body;
    const exists = await User.findOne({
        email,
    });

    if (exists)
        return res.status(200).json({
            msg: "already exists",
        });

    const user = new User({
        name,
        email,
    });
    await user.save();

    res.json({
        msg: "created successfully",
    });
});

app.get("/authentication/token", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).json({ error: "no token recieved" });

    try {
        const tokenParams = getTokenParams(code);
        const response = await axios.post(`${config.tokenUrl}?${tokenParams}`);
        const googleToken = response.data.id_token;
        const { name, email, picture } = jwt.decode(googleToken);
        const user = { name, email, picture };

        const token = jwt.sign({ user }, config.tokenSecret, {
            expiresIn: config.tokenExpiration,
        });

        res.json({
            user,
            token,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            err: "something went wrong!",
        });
    }
});

app.post("/user", (req, res) => {
    const user = jwt.decode(req.body.token);
    res.json(user);
});

app.get("/authentication/url", (_, res) => {
    res.json({ url: `${config.authUrl}?${authParams}` });
});

app.post("/api/counter", async (req, res) => {
    const { email } = req.body;

    try {
        const counter = await User.findOne({
            email,
        });
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/counter/increment", async (req, res) => {
    const email = req.body.email;
    try {
        let counter = await User.findOne({
            email,
        });
        if (!counter) {
            return res.json({
                err: "failed",
            });
        }
        counter.count++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/counter/decrement", async (req, res) => {
    const email = req.body.email;
    try {
        let counter = await User.findOne({
            email,
        });
        if (!counter) {
            return res.json({
                err: "failed",
            });
        }
        counter.count--;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/mycounter", async (req, res) => {
    const { email } = req.body;
    try {
        const counter = await User.findOne({
            email,
        });
        res.json(counter);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/mycounter/increment", async (req, res) => {
    const email = req.body.email;
    try {
        let counter = await User.findOne({
            email,
        });
        if (!counter) {
            return res.json({
                err: "failed",
            });
        }
        counter.myCount++;
        await counter.save();
        res.json(counter);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

app.post("/api/mycounter/decrement", async (req, res) => {
    const email = req.body.email;
    try {
        let counter = await User.findOne({
            email,
        });
        if (!counter) {
            return res.json({
                err: "failed",
            });
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
