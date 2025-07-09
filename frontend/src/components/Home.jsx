
import {Shell} from "lucide-react"
import NavbarLink from './Navbar/textComponent'
import Button from "./ui/Button"

const Home = () => {
  return (
    <div className='h-screen w-screen'>

      <div className='px-14 items-center h-16 w-full  border-b border-gray-200 flex justify-between ' >
        <div className='flex justify-center items-center text-black font-bold text-2xl ' >
          {<Shell />}
          <h1 className='ml-1' >FitConnect</h1>
        </div>
        <div className='flex  gap-x-2 justify-center items-center' >
          <div>
            <NavbarLink text={" Competitions "} to={"/signin"} />
            <NavbarLink text={" Trainers "} to={"/signin"} />
            <NavbarLink text={" About Us "} to={"/about"} />
          </div>
          <div className=" h-full w-fit px-6 border-x border-gray-300" >
            <Button className="rounded-full text-md font-semibold " >Login</Button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home