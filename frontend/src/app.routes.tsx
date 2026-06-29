import { createBrowserRouter } from "react-router";
import SignIn from "./features/auth/pages/SignIn";
import SignUp from "./features/auth/pages/SignUp";
import Home from "./features/evaluator/pages/Home";
import ReportDetails from "./features/evaluator/pages/ReportDetails";

export const router = createBrowserRouter([ 
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "/sign-up",
        element: <SignUp />,
    },
    {
        path: "/report/:interviewId",
        element: <ReportDetails />,
    }
])