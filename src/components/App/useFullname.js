import { useState } from "react";

export default function useFullname() {
  const getFullname = () => {
    const userId = localStorage.getItem("fullname");
    return userId;
  };

  const [fullname, setFullname] = useState(getFullname());
  const saveFullname = (fullname) => {
    localStorage.setItem("fullname", fullname);
    setFullname(fullname);
  };
  return {
    fullname,
    setFullname: saveFullname,
  };
}
