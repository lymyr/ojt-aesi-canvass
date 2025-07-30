import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../axios";

function Header({ onLogout }) {
    const [username, setUsername] = useState("");

    useEffect(() => {
        axios.get("/api/user")
            .then((res) => {
                setUsername(res.data.username);
            })
            .catch((err) => {
                console.error("Failed to fetch user", err);
            });
    }, []);

    return (
        <div className="header">
            <div className="headerLinks">
                <p>{username || "..."}</p>
                <p>reset password</p>
                <Link to="/" onClick={onLogout}><p>log out</p></Link>
            </div>
        </div>
    );
}

export default Header;