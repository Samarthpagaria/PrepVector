import { useMutation, useQuery } from "@tanstack/react-query";
import { registerUser, loginUser, logoutUser, getMeUser } from "../services/auth.api";
import { useAuthStore } from "../../../store/useAuth.store";
import { useToastStore } from "../../../store/toastStore";

export const useRegister = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const openToast = useToastStore((state) => state.openToast);

    return useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            openToast("Registration successful! Welcome aboard.");
            
            if (data && data.user) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                setUser(data.user);
            }
        },
        onError: (error: any) => {
            openToast(error?.response?.data?.message || error.message || "Registration failed", "error");
        }
    });
};

export const useLogin = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const openToast = useToastStore((state) => state.openToast);

    return useMutation({
        mutationFn: loginUser,
        onSuccess: (data) => {
            openToast("Logged in successfully!");
            
            if (data && data.user) {
                if (data.token) {
                    localStorage.setItem('token', data.token);
                }
                setUser(data.user);
            }
        },
        onError: (error: any) => {
            openToast(error?.response?.data?.message || error.message || "Login failed", "error");
        }
    });
};

export const useLogout = () => {
    const logout = useAuthStore((state) => state.logout);
    const openToast = useToastStore((state) => state.openToast);

    return useMutation({
        mutationFn: logoutUser,
        onSuccess: () => {
            openToast("Logged out successfully");
            localStorage.removeItem('token');
            logout();
        },
        onError: (error: any) => {
            openToast(error?.response?.data?.message || error.message || "Logout failed", "error");
        }
    });
};

export const useGetMe = () => {
    return useQuery({
        queryKey: ["authUser"],
        queryFn: getMeUser,
        retry: false, // Don't retry if it fails (e.g., user is not logged in / 401 error)
        refetchOnWindowFocus: false, // Prevent app remounts on tab switch
    });
};
