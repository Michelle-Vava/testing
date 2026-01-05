import { useState } from 'react';
import { ContentPageLayout } from '@/components/layout/ContentPageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';

interface FAQ {
  q: string;
  a: string;
}

interface FAQCategory {
  category: string;
  questions: FAQ[];
}

export function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQCategory[] = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How does Shanda work?',
          a: 'Shanda connects vehicle owners with trusted service providers. Post your service request, receive competing quotes, and choose the best provider for your needs.',
        },
        {
          q: 'Is Shanda free to use?',
          a: 'Yes! Creating an account and receiving quotes is completely free. We only charge a small platform fee when a job is completed.',
        },
        {
          q: 'How do I get started?',
          a: 'Simply sign up, add your vehicle information, and post your first service request. You\'ll start receiving quotes within hours!',
        },
      ],
    },
    {
      category: 'For Vehicle Owners',
      questions: [
        {
          q: 'How long does it take to receive quotes?',
          a: 'Most service requests receive their first quote within 2-4 hours. Urgent requests are prioritized and often get responses faster.',
        },
        {
          q: 'How do I choose the best provider?',
          a: 'Review each provider\'s rating, years in business, specialties, and quote price. You can also check their profile and previous customer reviews.',
        },
        {
          q: 'What if I\'m not satisfied with the service?',
          a: 'All work is guaranteed. If you\'re not satisfied, contact us within 7 days and we\'ll help resolve the issue or provide a refund.',
        },
      ],
    },
    {
      category: 'For Service Providers',
      questions: [
        {
          q: 'How do I become a service provider?',
          a: 'Click "Become a Provider" in your account menu, complete the onboarding with your business information, and start receiving job requests!',
        },
        {
          q: 'What fees does Shanda charge?',
          a: 'We charge a 5% platform fee on completed jobs. No monthly fees, no hidden costs. You only pay when you get paid.',
        },
        {
          q: 'Can I set my own prices?',
          a: 'Absolutely! You provide quotes based on your assessment. Shanda never dictates pricing - you\'re in control.',
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <ContentPageLayout title="Help" titleHighlight="Center">
      <div className="space-y-8">
        {/* Search */}
        <div>
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
          />
        </div>

        {/* FAQ Categories */}
        {filteredFaqs.map((category, catIdx) => (
          <div key={category.category}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">{category.category}</h2>
            <div className="space-y-3">
              {category.questions.map((faq, qIdx) => {
                const globalIdx = catIdx * 100 + qIdx;
                const isOpen = openFaq === globalIdx;
                
                return (
                  <Card key={qIdx} className="overflow-hidden">
                    <CardContent className="p-0">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : globalIdx)}
                        className="w-full text-left px-6 py-4 hover:bg-slate-50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-900">{faq.q}</span>
                        <svg
                          className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 text-slate-600">
                          {faq.a}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}

        {/* Still need help */}
        <div className="bg-slate-50 -mx-8 -mb-8 px-8 py-12 rounded-b-lg text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">Still need help?</h3>
          <p className="text-slate-600 mb-6">
            Can't find what you're looking for? Our support team is here to assist.
          </p>
          <Link to="/contact">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </ContentPageLayout>
  );
}
