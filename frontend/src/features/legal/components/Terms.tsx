import { ContentPageLayout } from '@/components/layout/ContentPageLayout';
import { ContentSection, ContentList, ContentText } from '@/components/content/ContentSection';

export function Terms() {
  return (
    <ContentPageLayout
      title="Terms of"
      titleHighlight="Service"
      lastUpdated="January 1, 2026"
    >
      <ContentSection title="1. Agreement to Terms">
        <ContentText>
          By accessing or using Service Connect ("the Platform"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
        </ContentText>
      </ContentSection>

      <ContentSection title="2. Use of Service">
        <ContentText className="mb-4">
          Service Connect is a digital marketplace platform that connects vehicle owners with independent automotive service providers. We facilitate introductions and transactions but do not provide vehicle maintenance or repair services directly.
        </ContentText>
        <ContentText className="mb-4">By using our platform, you agree to:</ContentText>
        <ContentList items={[
          'Provide accurate, current, and complete information during registration',
          'Maintain the security of your account credentials',
          'Not misuse the platform for fraudulent, illegal, or harmful purposes',
          'Not post false or misleading service requests or quotes',
          'Respect other users, providers, and community guidelines',
          'Not attempt to circumvent our payment system to avoid fees',
        ]} />
      </ContentSection>

      <ContentSection title="3. Provider Relationships">
        <ContentText className="mb-4">
          All service providers on Service Connect are independent contractors and not employees or agents of Service Connect. Providers set their own rates, schedules, and service offerings.
        </ContentText>
        <ContentText>
          Service Connect performs verification checks on providers but is not responsible for the quality, timeliness, safety, or outcome of services performed. Any disputes regarding service quality should be resolved directly between the customer and provider, with Service Connect available for mediation if needed.
        </ContentText>
      </ContentSection>

      <ContentSection title="4. Payments and Fees">
        <ContentText className="mb-4">
          All payments are processed securely through our payment partner, Stripe. Service Connect charges the following fees:
        </ContentText>
        <ContentList items={[
          'Service fee: 8% on completed jobs (charged to providers)',
          'Payment processing fee: 2.9% + $0.30 per transaction',
          'No fees for quote requests or account creation',
        ]} />
        <ContentText className="mt-4 mb-4">Cancellation and Refund Policy:</ContentText>
        <ContentList items={[
          'Free cancellation up to 24 hours before scheduled service',
          'Cancellations within 24 hours may incur a provider-set cancellation fee (max 25% of quote)',
          'No-shows may result in full payment to provider and account warnings',
          'Disputes must be raised within 48 hours of service completion',
          'Refunds processed within 5-7 business days when approved',
        ]} />
      </ContentSection>

      <ContentSection title="5. User Conduct and Prohibited Activities">
        <ContentText className="mb-4">You may not:</ContentText>
        <ContentList items={[
          'Use the platform for any illegal purpose or to violate any laws',
          'Harass, abuse, or harm other users or providers',
          'Post spam, advertisements, or commercial solicitations',
          'Attempt to gain unauthorized access to the platform or user accounts',
          'Use automated systems to scrape or collect data from the platform',
          'Impersonate another person or entity',
        ]} />
        <ContentText className="mt-4">
          Violation of these terms may result in immediate account suspension or termination.
        </ContentText>
      </ContentSection>

      <ContentSection title="6. Dispute Resolution and Arbitration">
        <ContentText className="mb-4">
          Any disputes arising from use of Service Connect shall be resolved through binding arbitration in accordance with the laws of Ontario, Canada. Both parties agree to waive their right to a trial by jury.
        </ContentText>
        <ContentText>
          For disputes under $5,000 CAD, we encourage resolution through our internal dispute resolution process before pursuing arbitration.
        </ContentText>
      </ContentSection>

      <ContentSection title="7. Limitation of Liability">
        <ContentText className="mb-4">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, SERVICE CONNECT SHALL NOT BE LIABLE FOR:
        </ContentText>
        <ContentList items={[
          'Any damages to your vehicle resulting from provider services',
          'Lost profits, data, or business opportunities',
          'Personal injury or property damage',
          'Provider conduct, negligence, or service quality',
          'Indirect, incidental, or consequential damages',
        ]} />
        <ContentText className="mt-4">
          Our total liability shall not exceed the fees paid by you to Service Connect in the past 12 months, or $100 CAD, whichever is less.
        </ContentText>
      </ContentSection>

      <ContentSection title="8. Warranty Disclaimer">
        <ContentText>
          THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. We do not guarantee uninterrupted access, error-free operation, or that the platform will meet your specific requirements.
        </ContentText>
      </ContentSection>

      <ContentSection title="9. Changes to Terms">
        <ContentText>
          We reserve the right to modify these terms at any time. Material changes will be communicated via email or platform notification. Continued use of the platform after changes constitutes acceptance of the new terms.
        </ContentText>
      </ContentSection>

      <ContentSection title="10. Contact">
        <ContentText>
          For questions about these Terms, contact us at:{' '}
          <a href="mailto:legal@serviceconnect.com" className="text-slate-900 hover:text-slate-700 hover:underline font-medium">
            legal@serviceconnect.com
          </a>
        </ContentText>
      </ContentSection>
    </ContentPageLayout>
  );
}
