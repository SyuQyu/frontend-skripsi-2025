import Link from "next/link"

function footerLayout() {
  return (
    <div className="text-center ">
      <Link href="/contact-us" className="  absolute bottom-3 left-1/2 transform -translate-x-1/2">
        Trauma & Empathy &copy;2024,

        Contact Us

        .
      </Link>
    </div>
  )
}

export default footerLayout
