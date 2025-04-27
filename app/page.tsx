import HeroSection from '@/components/landing/hero-section'
import Navbar from '@/components/landing/navbar'
import FeaturesSection from '@/components/landing/features-section'
import DemoPreview from '@/components/landing/demo-preview'
import ProcessTimeline from '@/components/landing/process-timeline'
import PricingSection from '@/components/landing/pricing-section'
import Footer from '@/components/landing/footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <DemoPreview />
      <ProcessTimeline />
      <PricingSection />
      <Footer />
    </main>
  )
}
