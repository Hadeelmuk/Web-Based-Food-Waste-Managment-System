import { PublicNav } from "@/components/public-nav"
import { PublicFooter } from "@/components/public-footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, Recycle, TrendingUp, Users, Heart, Building2, Sprout } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/sustainable-farm-with-fresh-vegetables-and-coffee-.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.12,
          }}
        />
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0) 50%)"
          }}
        />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 border border-primary/20">
              <Leaf className="w-4 h-4" />
              <span className="text-sm font-medium">Sustainable Business Solutions</span>
            </div>
            <h1 className="font-display font-bold text-5xl md:text-7xl text-foreground mb-6 text-balance leading-tight">
              Turning Food Waste into Sustainable Value 🌿
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-2xl mx-auto">
              Connecting cafés, NGOs, and farms to reduce food waste and promote sustainability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all"
                >
                  Register Your Business
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-10 py-7 border-2 bg-card hover:bg-muted">
                  Log In
                </Button>
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary mb-1">10k+</div>
                <div className="text-sm text-muted-foreground">Kg Waste Saved</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-display font-bold text-primary mb-1">95%</div>
                <div className="text-sm text-muted-foreground">Less Waste</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-card">
        <div className="container mx-auto">
          <h2 className="font-display font-bold text-4xl text-center mb-12 text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">1. Cafés log their waste</h3>
              <p className="text-muted-foreground leading-relaxed">
                Cafés and restaurants track daily food waste, coffee grounds, and organic materials in our simple
                dashboard.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">2. NGOs and farms receive it</h3>
              <p className="text-muted-foreground leading-relaxed">
                Donate edible food to NGOs or send organic waste and coffee grounds to local farms for composting.
              </p>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display font-bold text-xl mb-3 text-foreground">3. The system tracks progress</h3>
              <p className="text-muted-foreground leading-relaxed">
                Earn sustainability points and see your environmental impact grow as you contribute to a circular
                economy.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact at a Glance Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="font-display font-bold text-4xl text-center mb-12 text-foreground">Impact at a Glance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">10,500+</div>
              <div className="text-sm text-muted-foreground font-medium">Total Waste Redirected</div>
              <div className="text-xs text-muted-foreground mt-1">kg diverted from landfills</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-red-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">2,340+</div>
              <div className="text-sm text-muted-foreground font-medium">Total Donations Completed</div>
              <div className="text-xs text-muted-foreground mt-1">successful food donations</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-secondary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-secondary" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">150+</div>
              <div className="text-sm text-muted-foreground font-medium">Farms & Charities Supported</div>
              <div className="text-xs text-muted-foreground mt-1">active partners in our network</div>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-card border-2 border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Sprout className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-foreground mb-1">2,100+</div>
              <div className="text-sm text-muted-foreground font-medium">Estimated CO₂ Saved</div>
              <div className="text-xs text-muted-foreground mt-1">kg of carbon emissions avoided</div>
            </Card>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
