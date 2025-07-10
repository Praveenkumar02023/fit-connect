
import {Plus, Shell} from "lucide-react"
import NavbarLink from './LandingPage/TextComponent.jsx'
import Button from "./ui/Button.jsx"
import FeatureCard from "./LandingPage/featureCard.jsx"
import WhoCard from "./LandingPage/WhoCard.jsx"
import LogoSlider from "./LandingPage/LogoSlider.jsx"
import Reviews from "./LandingPage/Reviews.jsx"
import TopMentor from "./LandingPage/TopMentor.jsx"

const Home = () => {
  return (
    <div className='min-h-screen w-full flex flex-col overflow-x-hidden gap-y-4 '>

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
            <Button size="md" className="transform-transition hover:scale-105 rounded-full text-md font-semibold " >Login</Button>
          </div>
          <Button className=" items-center justify-center rounded-full ml-2 flex text-sm font-semibold border-gray-400 text-gray-600 hover:bg-blue-100 hover:border-blue-400 hover:text-blue-600 transform-transition hover:scale-105 " size="md" variant="outline" >{<Plus size={20}/>}Host</Button>
        </div>
      </div>
      
      {/* hero section */}
      <div className="py-24 flex h-[60vh] w-full px-[10%] justify-between">
        
        <div className="w-[45%] flex flex-col h-full items-center justify-center" >
        
          <h1 className=" text-6xl flex font-bold" ><h3 className="mr-2 text-blue-700" > Unlock </h3>  Your Fitness</h1>
          
          <p className="text-center pt-2 text-gray-500 text-lg flex flex-wrap w-[70%]" >Train. Transform. Compete. FitConnect connects top trainers, goal-driven clients, and world-class fitness events.</p>
        
        </div>
       
        <div className="  w-[50%]  p-12  h-full justify-center  items-center grid grid-cols-2 gap-y-4 " >
                      
            <FeatureCard title={"Trainers"} subtitle={"Training From Top Trainers."} bgColor={"bg-violet-300/80"} image={"../../public/trainer.png"} />
            
            <FeatureCard title={"Competitions"} subtitle={"Compete With Athletes."} bgColor={"bg-green-300/80"} image={"../../public/compete.png"} />
            
            <FeatureCard title={"Prizes"} subtitle={"Win By Competing."} bgColor={"bg-yellow-300/80"} image={"../../public/trophy.png"} />
            
            <FeatureCard title={"Nutrition "} subtitle={"Diets From Certified Experts."} bgColor={"bg-blue-300/80"} image={"../../public/diet.png"} />


        </div>
      </div>

      <div className="px-14 w-full ">
        <h1 className="text-lg font-semibold " >Who's using FitConnect? </h1>
        <div className="flex gap-x-2 w-full pt-4 " >
          <WhoCard title={"Fitness Trainers"} description={"Grow your brand, manage clients, and host training sessions effortlessly."} image={"/whoTrainer.png"} />
          <WhoCard title={"All Age Groups"} description={"From teens to elders — FitMan empowers every generation to stay fit, healthy, and engaged."} image={"/elder.png"} />
          <WhoCard  title={"Athletes"} description={"Participate in intense competitions, track performance, and win exciting rewards."} image={"/athelte.png"} />
        </div>

       
      </div>
      
      {/* logoslider */}
      <LogoSlider  />

      {/* Review component */}
      <Reviews/>

      <TopMentor/>

    </div>
  )
}


export default Home