const API_URL = import.meta.env.VITE_API_URL;
declare const toastr: any;

export interface RegisterUser {
    userName: string;
    email: string;
    address?: string;
}

export async function createUser(user: RegisterUser) {
    const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });

    if (!res.ok) {
        toastr.error("Please choose another username", "Error");
        throw new Error("User creation failed");
    }

    return res.json();
}
