import { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.clear();
    window.location.href = "/logout";
  }, []) 

  return <span>Login out...</span>
}

export default Logout;
