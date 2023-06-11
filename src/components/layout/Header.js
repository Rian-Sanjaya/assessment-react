import { useSelector } from "react-redux";
import { getTitle } from "../../store/header";

function Header() {
  const title = useSelector(getTitle);

  return (
    <div className="layout-header-box">
      <span className="title">{ title }</span>
    </div>
  )
}

export default Header;