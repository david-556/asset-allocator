import Link from "next/link"

export default function HomePage() {
  return (
    <main>
      <h1>Home Page</h1>
      <p>
        <Link href="/holdings">Go to Holdings</Link>
      </p>
    </main>
  )
}