import React from "react"

const LoadingScreen: React.FC = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <div className="flex">
        <div className="relative">
          {/* <!-- Outer Ring--> */}
          <div className="w-12 h-12 rounded-full absolute
                            border-2 border-solid border-gray-200"
          >
          </div>

          {/* <!-- Inner Ring --> */}
          <div className="w-12 h-12 rounded-full animate-spin absolute
                            border-2 border-solid border-blue-500 border-t-transparent"
          >
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
