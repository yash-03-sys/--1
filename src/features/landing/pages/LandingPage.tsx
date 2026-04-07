import { HeroSection } from '../components/HeroSection';
import { WorkflowSection } from '../components/WorkflowSection';
import { WorkspacePreviewSection } from '../components/WorkspacePreviewSection';
import { FeatureGridSection } from '../components/FeatureGridSection';
import { SourceIntelligenceSection } from '../components/SourceIntelligenceSection';
import { UseCasesSection } from '../components/UseCasesSection';
import { ProductPreviewSection } from '../components/ProductPreviewSection';
import { CTASection } from '../components/CTASection';
import { Navbar } from '@/src/components/common/Navbar';
import { Footer } from '@/src/components/common/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-dark overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <WorkspacePreviewSection />
      <FeatureGridSection />
      <SourceIntelligenceSection />
      <UseCasesSection />
      <ProductPreviewSection />
      <CTASection />
      <Footer />
    </div>
  );
}
