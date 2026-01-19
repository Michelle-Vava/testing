import { ContentPageLayout } from '@/components/layout/ContentPageLayout';
import { ContentSection, ContentText } from '@/components/content/ContentSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AXIOS_INSTANCE } from '@/lib/axios';

export function About() {
  const { data: statsData } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const response = await AXIOS_INSTANCE.get('/platform/stats');
      return response.data;
    },
  });

  const stats = [
    { label: 'Happy Customers', value: statsData?.customers?.toLocaleString() || '0' },
    { label: 'Verified Providers', value: statsData?.providers?.toLocaleString() || '0' },
    { label: 'Jobs Completed', value: statsData?.jobsCompleted?.toLocaleString() || '0' },
    { label: 'Average Savings', value: statsData?.averageSavings ? `$${statsData.averageSavings}` : '$0' },
  ];

  const values = [
    {
      title: 'Transparency',
      description: 'No hidden fees. See exactly what you\'re paying for before you commit.',
      icon: '🔍',
    },
    {
      title: 'Trust',
      description: 'All service providers are verified, licensed, and insured.',
      icon: '✓',
    },
    {
      title: 'Competition',
      description: 'Get multiple quotes and choose the best price and service for you.',
      icon: '💰',
    },
    {
      title: 'Convenience',
      description: 'Book services, track progress, and pay—all in one platform.',
      icon: '⚡',
    },
  ];

  return (
    <ContentPageLayout title="About" titleHighlight="Shanda" showBackLink>
      <div className="space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4">
          <ContentText className="text-xl">
            Shanda is a platform connecting vehicle owners with trusted mechanics across Canada. We believe car maintenance should be transparent, competitive, and convenient.
          </ContentText>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <ContentSection title="Our Mission">
          <ContentText className="mb-4">
            We're building the future of vehicle maintenance in Canada. Too many drivers overpay for basic services or don't know where to turn when their check engine light comes on.
          </ContentText>
          <ContentText>
            Shanda puts power back in your hands—compare quotes, read reviews, and book with confidence.
          </ContentText>
        </ContentSection>

        {/* Values */}
        <ContentSection title="What We Stand For">
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {values.map((value) => (
              <Card key={value.title}>
                <CardContent className="py-6">
                  <div className="text-4xl mb-3">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ContentSection>

        {/* Team */}
        <ContentSection title="Built in Canada">
          <ContentText className="mb-4">
            We're a small team based in Halifax, Nova Scotia, with a big vision: make vehicle ownership less stressful and more affordable for everyone.
          </ContentText>
          <ContentText>
            Currently live in Halifax, Toronto, and Vancouver—with more cities launching soon.
          </ContentText>
        </ContentSection>

        {/* CTA */}
        <div className="bg-slate-50 -mx-8 -mb-8 px-8 py-12 rounded-b-lg text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Get Started?</h3>
          <ContentText className="mb-6 max-w-2xl mx-auto">
            Join thousands of Canadians who've found better prices and better service on Shanda.
          </ContentText>
          <Link to="/auth/signup" search={{ mode: 'owner' }}>
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
              Create Free Account
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  );
}
