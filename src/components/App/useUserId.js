import { useState } from "react";

export default function useUserId() {
  const getId = () => {
    const userId = localStorage.getItem("userId");
    const Id = parseInt(userId);
    return Id;
  };

  const [userId, setUserId] = useState(getId());
  const saveId = (userId) => {
    localStorage.setItem("userId", userId);
    setUserId(userId);
  };
  return {
    userId,
    setUserId: saveId,
  };
}
