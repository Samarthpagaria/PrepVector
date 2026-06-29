import { useMutation, useQuery } from "@tanstack/react-query";
import { registerUser, loginUser, logoutUser, getMeUser } from "../services/auth.api";
import { useAuthStore } from "../../../store/useAuth.store";

export const useRegister = () => {
    // Bring in our Zustand setter
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            console.log("Registration successful!", data);
            
            // The backend responds with { message: "User registered successfully", user: { ... } }
            // So we grab data.user and set it in our global Zustand store!
            if (data && data.user) {
                setUser(data.user);
            }
        },
        onError: (error) => {
            console.error("Registration failed:", error);
        }
    });
};

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            console.log("Login successful!", data);
            
            if (data && data.user) {
                setUser(data.user);
            }
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            console.log("Logout successful!");
            // Clear the user from Zustand global state
            logout();
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        }
    });
};

export const useGetMe = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: getMeUser,
        retry: false, // Don't retry if it fails (e.g., user is not logged in / 401 error)
    });
};
