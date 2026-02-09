import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Sprout } from "lucide-react"
import Image from "next/image"

export function PublicNav() {
  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/placeholder-logo.png"
              alt="From Plate to Plant Logo"
              width={48}
              height={48}
              className="h-12 w-12 object-contain"
              priority
            />
            <span className="font-display font-bold text-xl text-foreground">From Plate to Plant</span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            <Link href="/login?role=charity">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Heart className="w-4 h-4 mr-2" />
                For Charities
              </Button>
            </Link>
            <Link href="/login?role=farmer">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                <Sprout className="w-4 h-4 mr-2" />
                For Farmers
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Register Business</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
