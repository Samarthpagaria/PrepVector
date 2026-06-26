import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:8000/api/v1/user",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})

export const registerUser = async ({ username, email, password }: {
    username: string,
    email: string,
    password: string
}) => {
    const response = await api.post("/register", {
        username,
        email,
        password
    })
    return response.data;
}

export const loginUser = async ({ email, password }: {
    email: string,
    password: string
}) => {
    const response = await api.post("/login", {
        email,
        password
    })
    return response.data;
}

export const logoutUser = async () => {
    const response = await api.get("/logout")
    return response.data;
}

export const getMeUser = async () => {
    const response = await api.get("/get-me")
    return response.data;
}