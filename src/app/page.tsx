import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HeroImage } from '@/components/HeroImage';
import { 
  CheckCircle, 
  Shield, 
  Star, 
  Home as HomeIcon, 
  Leaf, 
  Package, 
  Calendar, 
  User, 
  FileText,
  Heart,
  Baby,
  Headphones,
  ThumbsUp,
  Phone,
  Mail
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Trusted by families across South Africa</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Cleaning Services
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Transform your space with our expert cleaning solutions. Book now for a spotless home or office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/booking/service">
                  Book a Cleaning
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#contact">
                  Get a Free Quote
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <HeroImage />
          </div>
        </div>
      </section>

      {/* Service Types Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Standard Cleaning</CardTitle>
                <CardDescription>
                  Regular maintenance cleaning for your home
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">From R850</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Deep Cleaning</CardTitle>
                <CardDescription>
                  Comprehensive cleaning with eco-friendly products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">From R1200</div>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Package className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Move-In/Out Cleaning</CardTitle>
                <CardDescription>
                  Complete cleaning for moving transitions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">From R1500</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <User className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Professional Team</CardTitle>
              <CardDescription>
                Vetted and trained cleaning professionals
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Leaf className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Eco-Friendly Products</CardTitle>
              <CardDescription>
                Safe, environmentally conscious cleaning solutions
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <ThumbsUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Satisfaction Guarantee</CardTitle>
              <CardDescription>
                100% satisfaction or we make it right
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Book at your convenience, same-day available
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Insured & Bonded</CardTitle>
              <CardDescription>
                Fully insured for your peace of mind
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <CardTitle>Transparent Pricing</CardTitle>
              <CardDescription>
                No hidden fees, clear upfront pricing
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">A spotless home in three steps</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1 Book Online</h3>
              <p className="text-muted-foreground">Easy online booking in minutes</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2 We Arrive</h3>
              <p className="text-muted-foreground">Professional team arrives on time</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3 We Clean</h3>
              <p className="text-muted-foreground">Thorough cleaning with quality products</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">4 You Relax</h3>
              <p className="text-muted-foreground">Enjoy your spotless home</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Full-Time Support Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Looking for full-time support?</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <HomeIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Live-out Housekeeper</CardTitle>
              <CardDescription>
                Regular cleaning and household maintenance
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Baby className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Nanny</CardTitle>
              <CardDescription>
                Professional childcare services
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Carer</CardTitle>
              <CardDescription>
                Compassionate care for elderly or special needs
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* User Dashboard Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="bg-gray-200 rounded-full w-64 h-64 mx-auto mb-4 flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Your home, your dashboard</h2>
              <p className="text-muted-foreground mb-6">
                Track bookings, reschedule chat with your cleaner, and manage everything in one place.
              </p>
              <Button size="lg" asChild>
                <Link href="/dashboard">Explore Our Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Pros Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet some of our pros</h2>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Button variant="outline" size="sm">All</Button>
            <Button variant="outline" size="sm">Top-Rated</Button>
            <Button variant="outline" size="sm">Nearby</Button>
            <Button variant="outline" size="sm">Available This Week</Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-4"></div>
              <CardTitle>Sarah Johnson</CardTitle>
              <CardDescription>Professional Cleaner</CardDescription>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Experienced cleaner with 5+ years of service
              </p>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-4"></div>
              <CardTitle>Mike Chen</CardTitle>
              <CardDescription>Operations Manager</CardDescription>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Quality assurance specialist ensuring excellence
              </p>
            </CardHeader>
          </Card>
          
          <Card className="text-center">
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-20 h-20 mx-auto mb-4"></div>
              <CardTitle>Emma Davis</CardTitle>
              <CardDescription>Professional Cleaner</CardDescription>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Detail-oriented cleaner specializing in deep cleans
              </p>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Safety Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Safety comes first</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>ID & Background Checks</CardTitle>
                <CardDescription>
                  All cleaners are thoroughly vetted
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Public Liability Cover</CardTitle>
                <CardDescription>
                  Comprehensive insurance protection
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <Headphones className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>In-app Support</CardTitle>
                <CardDescription>
                  24/7 customer support available
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <ThumbsUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <CardTitle>Quality Guarantee</CardTitle>
                <CardDescription>
                  Satisfaction guaranteed or we make it right
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Work as a Professional Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Work as a cleaning professional</h2>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Set up your schedule</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Grow your income</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Get paid on time</span>
              </li>
            </ul>
            <Button size="lg" asChild>
              <Link href="/careers">Apply to Work</Link>
            </Button>
          </div>
          <div className="text-center">
            <div className="bg-gray-200 rounded-full w-64 h-64 mx-auto mb-4 flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
            <div className="bg-gray-200 h-4 w-32 mx-auto rounded"></div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by homeowners across Cape Town</h2>
          <div className="flex justify-center gap-8">
            <div className="bg-gray-200 h-16 w-32 rounded"></div>
            <div className="bg-gray-200 h-16 w-32 rounded"></div>
          </div>
        </div>
      </section>

      {/* Tips & Inspiration Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Tips & inspiration</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
              <CardTitle>10 Tips for Maintaining a Clean Home</CardTitle>
              <CardDescription>
                Simple strategies to keep your space spotless between professional cleanings.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
              <CardTitle>The Benefits of Professional Cleaning Services</CardTitle>
              <CardDescription>
                Discover why professional cleaning is worth the investment for your home.
              </CardDescription>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="bg-gray-200 rounded-full w-16 h-16 mx-auto mb-4"></div>
              <CardTitle>Eco-Friendly Cleaning Products Guide</CardTitle>
              <CardDescription>
                Learn about safe, environmentally conscious cleaning solutions.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Customer Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What our customers say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from our satisfied customers across Cape Town.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="font-semibold">Cape Town</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &ldquo;Outstanding service! The team was professional, punctual, and left our home spotless. 
                  Highly recommend Shalean for anyone looking for reliable cleaning services.&rdquo;
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 rounded-full w-12 h-12 mr-4"></div>
                  <div>
                    <div className="flex mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="font-semibold">Sea Point</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  &ldquo;Been using Shalean for over a year now. Consistent quality, fair pricing, 
                  and the cleaners are always respectful of our home. Couldn&apos;t be happier!&rdquo;
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white">About us</Link></li>
                <li><Link href="/team" className="text-gray-300 hover:text-white">Our Team</Link></li>
                <li><Link href="/why-choose" className="text-gray-300 hover:text-white">Why Choose Shalean</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/how-it-works" className="text-gray-300 hover:text-white">How it Works</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-white">Services</Link></li>
                <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
                <li><Link href="/quote" className="text-gray-300 hover:text-white">Get Quote</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-300 hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-gray-300">+27 21 123 4567</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-gray-300">info@shalean.co.za</span>
                </li>
                <li>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/contact">Contact Form</Link>
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
