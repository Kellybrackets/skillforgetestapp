import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-primary">SkillForge</CardTitle>
            <CardDescription>AI-powered learning platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Accelerate your learning journey with personalized AI recommendations and mentorship.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/register">Register</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
