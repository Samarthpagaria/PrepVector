import { createBrowserRouter } from "react-router";
import SignIn from "./features/auth/pages/SignIn";
import SignUp from "./features/auth/pages/SignUp";
import Home from "./pages/Home";

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
    }
])