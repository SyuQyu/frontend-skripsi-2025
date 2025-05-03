import Link from "next/link"

function footerLayout() {
  return (
    <div className="text-center ">
      <Link href="/" className="absolute bottom-3 mt-10 left-1/2 transform -translate-x-1/2">
        AnonChat &copy;2025
      </Link>
    </div>
  )
}

export default footerLayout
