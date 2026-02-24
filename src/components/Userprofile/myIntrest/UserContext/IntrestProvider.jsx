import React, { createContext, useState } from "react";
import axios from "axios";

export const InterestContext = createContext();

const API_BASE_URL = "http://localhost:5000/api";

export const InterestProvider = ({ children }) => {
    const [acceptedUsers, setAcceptedUsers] = useState([]);

    const acceptUser = (user) => {
        setAcceptedUsers((prevUsers) => [...prevUsers, user]);
    };

    const removeUser = async (userId) => {
        try {
            const userData = sessionStorage.getItem("userData");
            if (!userData) return;
            const parsedUserData = JSON.parse(userData);
            const loggedInUserId = parsedUserData._id;

            await axios.post(`${API_BASE_URL}/remove-accepted`, {
                userId: loggedInUserId,
                targetUserId: userId,
            });

            setAcceptedUsers((prevUsers) => prevUsers.filter(user => user._id !== userId));
            alert("Connection removed successfully");
        } catch (error) {
            console.error("Error removing connection:", error);
        }
    };

    return (
        <InterestContext.Provider value={{ acceptedUsers, acceptUser, removeUser }}>
            {children}
        </InterestContext.Provider>
    );
};
