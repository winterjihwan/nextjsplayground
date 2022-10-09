import Image from "next/image"
import styles from "../styles/Home.module.css"
import { HeaderComponent } from "../components/headerComponent"
import { Mainpage } from "../components/mainpage"

export default function Home() {
  return (
    <main>
      <HeaderComponent />
      <Mainpage />
    </main>
  )
}
