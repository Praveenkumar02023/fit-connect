
import {Link} from "react-router-dom"
const NavbarLink = ({text,to}) => {
  return (
    <Link to={to} className=' flex items-center justify-center h-7 font-semibold text-sm p-2 rounded-4xl w-fit  hover:bg-gray-200/90' >
        {text}
    </Link>
    
  )
}

export default NavbarLink