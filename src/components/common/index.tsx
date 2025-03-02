import dynamic from "next/dynamic"

const Button = dynamic(() => import("@/components/common/button/buttonCustom"))
const ImageWithFallback = dynamic(() => import("@/components/common/imageWithFallback/imageWithFallback"))
const Card = dynamic(() => import("@/components/common/card/cardCustom"))
const Input = dynamic(() => import("@/components/common/input/inputCustom"))
const OTPInput = dynamic(() => import("@/components/common/otpInput/otpInput"))
const StrengthBarPassword = dynamic(() => import("@/components/common/strengthBarPassword/strengthBarPassword"))
const TextArea = dynamic(() => import("@/components/common/textArea/textAreaCustom"))
const Drawer = dynamic(() => import("@/components/common/drawer/drawer"))
const Sheet = dynamic(() => import("@/components/common/sheet/sheet"))
const HamburgerMenu = dynamic(() => import("@/components/common/hamburgerMenu/hamburgerMenu"))
const AccordionCustom = dynamic(() => import("@/components/common/accordion/accordionCustom"))
const PostCard = dynamic(() => import("@/components/common/postCard/postCard"))
export {
  Button,
  ImageWithFallback,
  Card,
  Input,
  OTPInput,
  StrengthBarPassword,
  TextArea,
  Drawer,
  Sheet,
  HamburgerMenu,
  AccordionCustom,
  PostCard,
}
