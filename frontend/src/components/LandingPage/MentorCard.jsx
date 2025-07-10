const MentorCard = ({ name, role, image, rating }) => (

  <div className=" hover:border hover:border-black min-w-[260px] max-w-[280px] bg-white shadow rounded-xl overflow-hidden border">
    {/* Top Banner */}
    <div className="bg-violet-100 p-3 relative flex justify-between items-start">
      <span className="bg-blue-900 text-white text-xs px-2 py-1 rounded-full">Available</span>
    </div>

    {/* Profile Image */}
    <div className="flex justify-center items-center -mt-10">
      <img src={image} alt={name} className=" relative h-20 w-20 rounded-full border-4 border-white shadow" />
    </div>

    {/* Info Section */}
    <div className="p-4 text-center">
      <h3 className="font-semibold text-lg">{name} <span className="text-yellow-500">⭐ {rating}</span></h3>
      <p className="text-sm text-gray-600 mt-1">{role}</p>

      <button className="mt-4 px-4 py-1.5 text-sm rounded-full border hover:bg-blue-100 hover:border-blue-400 hover:text-blue-400 cursor-pointer">
        View Profile
      </button>
    </div>
  </div>
);

export default MentorCard