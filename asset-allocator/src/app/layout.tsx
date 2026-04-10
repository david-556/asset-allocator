import type { ReactNode } from "react"
import Navbar from "../components/Navbar"

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#000" }}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
