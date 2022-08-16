import { useState } from "react";

export default function useRole() {
  const getRole = () => {
    const roleString = localStorage.getItem("role");
    const userRole = JSON.parse(roleString);
    return userRole;
  };
  const r = getRole();
  const [role, setRole] = useState(r);

  const saveRole = (userRole) => {
    localStorage.setItem("role", JSON.stringify(userRole));
    setRole(userRole);
  };
  return {
    role,
    // eslint-disable-next-line prettier/prettier
    setRole: saveRole
  };
}
