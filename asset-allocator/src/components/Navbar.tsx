"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./navbar.module.css"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/holdings", label: "Holdings" },
  { href: "/targets", label: "Targets" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <span className={styles.brand}>Asset Allocator</span>
        <div className={styles.links}>
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.link} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
