import { Link } from "react-router-dom"

function Header() {
    return(
        <div className="header">
            <div className="headerLinks">
                <p>username</p>
                <p>reset password</p>
                <Link to="/"><p>log out</p></Link>
            </div>
        </div>
    )
}

export default Header