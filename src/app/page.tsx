import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/10">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Professional Cleaning Services
            <span className="text-primary block">Made Simple</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Book trusted cleaners for your home or office. Quality service, 
            competitive prices, and complete peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="http://localhost:3001/booking/service">
                Book Now
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#services">
                View Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Quality Guaranteed</CardTitle>
              <CardDescription>
                All cleaners are vetted, insured, and background-checked for your safety.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Book services at your convenience with same-day and advance booking options.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>100% Satisfaction</CardTitle>
              <CardDescription>
                Not happy? We&apos;ll make it right with our satisfaction guarantee.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of professional cleaning services tailored to your needs.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Standard Cleaning</CardTitle>
              <CardDescription>
                Regular cleaning for your home including dusting, vacuuming, and bathroom cleaning.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$50</span>
                <Button asChild>
                  <Link href="http://localhost:3001/booking/service">Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Deep Cleaning</CardTitle>
              <CardDescription>
                Comprehensive cleaning including inside appliances, baseboards, and detailed scrubbing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$120</span>
                <Button asChild>
                  <Link href="http://localhost:3001/booking/service">Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Move-in/out Cleaning</CardTitle>
              <CardDescription>
                Complete cleaning for moving in or out, including inside cabinets and appliances.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">$150</span>
                <Button asChild>
                  <Link href="http://localhost:3001/booking/service">Book Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;Excellent service! The cleaner was professional and thorough. 
                My home has never looked better.&rdquo;
              </p>
              <p className="font-semibold">- Sarah M.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;Reliable and trustworthy. I&apos;ve been using their services for months 
                and always satisfied with the results.&rdquo;
              </p>
              <p className="font-semibold">- John D.</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                &ldquo;Great value for money. The booking process was easy and the cleaner 
                arrived exactly on time.&rdquo;
              </p>
              <p className="font-semibold">- Lisa K.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their cleaning needs.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="http://localhost:3001/booking/service">
                Book Your First Service
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
