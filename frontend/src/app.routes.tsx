import { createBrowserRouter } from "react-router";
import SignIn from "./features/auth/pages/SignIn";
import SignUp from "./features/auth/pages/SignUp";

export const router = createBrowserRouter([ 
    {
        path: "/sign-in",
        element: <SignIn />,
    },
    {
        path: "/sign-up",
        element: <SignUp />,
    }
])