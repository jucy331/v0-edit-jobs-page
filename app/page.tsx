import { redirect } from "next/navigation"

export default function HomePage() {
  // Redirect to jobs page as the main landing page
  redirect("/jobs")
}
