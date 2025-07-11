import React from 'react'

const ReviewCard = ({name,username,image,review,role}) => {
  return (
    <div className='flex flex-col p-6 text-black h-auto w-[40vh] bg-gray-100 border border-gray-400 rounded-3xl' >
        <div className='flex ' >
            <img className='h-12 bg-gray rounded-full' src={image} alt="name" />
            <div className='px-4 flex flex-col text-center'>
                <h2 className='text-lg font-semibold' > {name}</h2>
                <p className='text-xs font-semibold' >{username}</p>
                <p className='text-xs font-semibold' >{role}</p>
            </div>
        </div>
        <div className='py-4 flex justify-start flex-wrap text-gray-600' >
            {review}
        </div>
    </div>
  )
}

export default ReviewCard