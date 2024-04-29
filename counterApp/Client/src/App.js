import React, { useEffect, useContext, useReducer, useCallback } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useNavigate,
} from "react-router-dom";
import axios from "axios";

const CounterContext = React.createContext();
const counterReducer = (state, action) => {
    if (action.counter === "count") {
        switch (action.type) {
            case "SET":
                return { count: action.count, myCount: state.myCount };
            case "INCREMENT":
                return { count: state.count + 1, myCount: state.myCount };
            case "DECREMENT":
                return { count: state.count - 1, myCount: state.myCount };
            default:
                return state;
        }
    } else {
        switch (action.type) {
            case "SET":
                return { myCount: action.myCount, count: state.count };
            case "INCREMENT":
                return { myCount: state.myCount + 1, count: state.count };
            case "DECREMENT":
                return { myCount: state.myCount - 1, count: state.count };
            default:
                return state;
        }
    }
};

const Home = () => {
    const { state } = useContext(CounterContext);
    return (
        <div>
            <h1>Counter Value: {state.count}</h1>
            <h1>MyCounter Value: {state.myCount}</h1>
            <Link to="/counter">Counter</Link>
        </div>
    );
};

const Counter = () => {
    const { state, dispatch } = useContext(CounterContext);
    const navigate = useNavigate();

    const fetchCounter = useCallback(async () => {
        try {
            const response = await axios.get(
                "https://fs-aani.onrender.com/api/counter",
            );
            dispatch({
                counter: "count",
                type: "SET",
                count: response.data.count,
            });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/counter/increment",
            );
            dispatch({ counter: "count", type: "INCREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    const decrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/counter/decrement",
            );
            dispatch({ counter: "count", type: "DECREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

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
            const response = await axios.get(
                "https://fs-aani.onrender.com/api/mycounter",
            );
            dispatch({
                counter: "myCount",
                type: "SET",
                myCount: response.data.myCount,
            });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    useEffect(() => {
        fetchCounter();
    }, [fetchCounter]);

    const incrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/mycounter/increment",
            );
            dispatch({ counter: "myCount", type: "INCREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

    const decrementCounter = useCallback(async () => {
        try {
            await axios.post(
                "https://fs-aani.onrender.com/api/mycounter/decrement",
            );
            dispatch({ counter: "myCount", type: "DECREMENT" });
        } catch (err) {
            console.error(err);
        }
    }, [dispatch]);

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
    });

    useEffect(() => {
        const fetchInitialValues = async () => {
            try {
                const responseCounter = await axios.get(
                    "https://fs-aani.onrender.com/api/counter",
                );
                const responseMyCounter = await axios.get(
                    "https://fs-aani.onrender.com/api/mycounter",
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
                        </ul>
                    </nav>

                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/counter" element={<Counter />} />
                        <Route path="/mycounter" element={<MyCounter />} />
                    </Routes>
                </div>
            </Router>
        </CounterContext.Provider>
    );
};

export default App;
