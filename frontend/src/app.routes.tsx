import { createBrowserRouter } from "react-router";
import SignIn from "./features/auth/pages/SignIn";
import SignUp from "./features/auth/pages/SignUp";
import Home from "./features/evaluator/pages/Home";
import ReportDetails from "./features/evaluator/pages/ReportDetails";

import Layout from "./layouts/Layout";
import Dashboard from "./features/dashboard/pages/Dashboard";
import ResumeBuilder from "./features/ResumeBuilder/pages/Resumebuilder";
import Preview from "./features/resume/pages/Preview";

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
    },
    {
        path: "app",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "builder/:resumeId",
                element: <ResumeBuilder />,
            }
        ]
    },
    {
        path: "view/:resumeId",
        element: <Preview />,
    }
])