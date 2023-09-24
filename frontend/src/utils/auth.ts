// utils/fetchUserData.ts
import axios from "axios";

export const fetchUserData = async () => {
  try {
    const response = await axios.get("http://your-backend-url/userinit");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
