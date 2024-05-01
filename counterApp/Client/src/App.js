import React, { useEffect, useContext, useReducer, useCallback } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";
import axios from "axios";
import Login from "./components/Login";
import CounterContext from "./context/context";
import Callback from "./components/Callback";
import Cookies from "js-cookie";

const counterReducer = (state, action) => {
    if (action.clearData) {
        return {
            count: 0,
            myCount: 0,
            loggedIn: false,
            name: "",
            email: "",
            picture: "",
        };
    }

    if (action.loginState) {
        return {
            ...state,
            name: action.name,
            email: action.email,
            picture: action.picture,
        };
    }

    if (action.counter === "count") {
        switch (action.type) {
            case "SET":
                return { ...state, count: action.count };
            case "INCREMENT":
                return { ...state, count: state.count + 1 };
            case "DECREMENT":
                return { ...state, count: state.count - 1 };
            default:
                return state;
        }
    } else {
        switch (action.type) {
            case "SET":
                return { ...state, myCount: action.myCount };
            case "INCREMENT":
                return { ...state, myCount: state.myCount + 1 };
            case "DECREMENT":
                return { ...state, myCount: state.myCount - 1 };
            default:
                return state;
        }
    }
};

const Home = () => {
    const navigate = useNavigate();
    const { dispatch, state } = useContext(CounterContext);

    useEffect(() => {
        (async () => {
            const token = Cookies.get("token");
            if (!token) navigate("/login");
            const response = await axios.post(
                "https://fs-aani.onrender.com/user",
                {
                    token: token,
                },
            );
            const { name, email, picture } = response.data.user;
            dispatch({
                loginState: true,
                name: name,
                email: email,
                picture: picture,
            });
        })();
    }, []);

    return (
        <div>
            <img src={state.picture} alt="profile" />
            <h1>Hello: {state.name}</h1>
            <h2>Counter Value: {state.count}</h2>
            <h2>MyCounter Value: {state.myCount}</h2>
        </div>
    );
};

const Counter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();

    const fetchCounter = useCallback(async () => {
        try {
            const response = await axios.post(
                "https://fs-aani.onrender.com/api/counter",
                {
                    email: state.email,
                },
            );

            dispatch({
                counter: "count",
                type: "SET",
                count: response.data.count,
            });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, state]);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) navigate("/login");
    }, [navigate]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/counter/increment",
                {
                    email: state.email,
                },
            );
            dispatch({ counter: "count", type: "INCREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, state]);

    const decrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/counter/decrement",
                {
                    email: state.email,
                },
            );
            dispatch({ counter: "count", type: "DECREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, state]);

    return (
        <div>
            <h2>Counter</h2>
            <p>Count: {state.count}</p>
            <p>MyCount: {state.myCount}</p>
            <button onClick={incrementCounter}>Increment</button>
            <button onClick={decrementCounter}>Decrement</button>
            <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
    );
};

const MyCounter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();

    const fetchCounter = useCallback(async () => {
        try {
            const response = await axios.post(
                "https://fs-aani.onrender.com/api/mycounter",
                {
                    email: state.email,
                },
            );

            dispatch({
                counter: "myCount",
                type: "SET",
                myCount: response.data.myCount,
            });
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) navigate("/login");
    }, [navigate]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/mycounter/increment",
                {
                    email: state.email,
                },
            );
            dispatch({ counter: "myCount", type: "INCREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, state]);

    const decrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/mycounter/decrement",
                {
                    email: state.email,
                },
            );
            dispatch({ counter: "myCount", type: "DECREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch, state]);

    return (
        <div>
            <h2>MyCounter</h2>
            <p>Count: {state.count}</p>
            <p>MyCount: {state.myCount}</p>
            <button onClick={incrementCounter}>Increment</button>
            <button onClick={decrementCounter}>Decrement</button>
            <button onClick={() => navigate("/")}>Go to Home</button>
        </div>
    );
};

const App = () => {
    const [state, dispatch] = useReducer(counterReducer, {
        count: 0,
        myCount: 0,
        loggedIn: false,
        name: "",
        email: "",
        picture: "",
    });

    useEffect(() => {
        const fetchInitialValues = async () => {
            setTimeout(async () => {
                const token = Cookies.get("token");
                const response = await axios.post(
                    "https://fs-aani.onrender.com/user",
                    {
                        token,
                    },
                );

                const { name, email, picture } = response.data.user;

                dispatch({
                    loginState: true,
                    name: name,
                    email: email,
                    picture: picture,
                });

                try {
                    const responseCounter = await axios.post(
                        "https://fs-aani.onrender.com/api/counter",
                        {
                            email,
                        },
                    );
                    const responseMyCounter = await axios.post(
                        "https://fs-aani.onrender.com/api/mycounter",
                        {
                            email,
                        },
                    );

                    dispatch({
                        counter: "count",
                        type: "SET",
                        count: responseCounter.data.count,
                    });

                    dispatch({
                        counter: "myCount",
                        type: "SET",
                        myCount: responseMyCounter.data.myCount,
                    });
                } catch (e) {
                    console.error(e);
                }
            }, 500);
        };

        fetchInitialValues();
    }, []);

    return (
        <CounterContext.Provider value={{ state, dispatch }}>
            <Router>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <Link to="/">Home</Link>
                            </li>
                            <li>
                                <Link to="/counter">Counter</Link>
                            </li>
                            <li>
                                <Link to="/mycounter">MyCounter</Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    onClick={() => {
                                        Cookies.remove("token");
                                        dispatch({ clearData: true });
                                    }}
                                >
                                    Logout
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <Routes>
                        {/* <Route element={<PrivateRoutes />}>
                        </Route> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/counter" element={<Counter />} />
                        <Route path="/mycounter" element={<MyCounter />} />
                        <Route path="/callback" element={<Callback />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </div>
            </Router>
        </CounterContext.Provider>
    );
};

export default App;
