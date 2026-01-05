import { ContentPageLayout } from '@/components/layout/ContentPageLayout';
import { ContentSection, ContentList, ContentText } from '@/components/content/ContentSection';

export function Privacy() {
  return (
    <ContentPageLayout
      title="Privacy"
      titleHighlight="Policy"
      lastUpdated="January 1, 2026"
    >
      <ContentSection title="1. Information We Collect">
        <ContentText className="mb-4">
          We collect several types of information to provide and improve our services:
        </ContentText>
        <ContentText className="font-medium mb-2">Information you provide directly:</ContentText>
        <ContentList items={[
          'Name, email address, and phone number',
          'Home or business address',
          'Vehicle information (make, model, year, VIN, license plate, mileage)',
          'Service request details and descriptions',
          'Payment information (processed and stored securely by Stripe)',
          'Profile photos and business information (for providers)',
          'Communications with us and with service providers',
        ]} />
        <ContentText className="font-medium mb-2 mt-4">Information collected automatically:</ContentText>
        <ContentList items={[
          'IP address and device information',
          'Browser type and version',
          'Usage data and interactions with the platform',
          'Location data (with your permission)',
          'Cookies and similar tracking technologies',
        ]} />
      </ContentSection>

      <ContentSection title="2. How We Use Your Information">
        <ContentText className="mb-4">
          We use the information we collect for the following purposes:
        </ContentText>
        <ContentList items={[
          'Provide, maintain, and improve our marketplace services',
          'Connect vehicle owners with qualified service providers',
          'Process payments and send transaction confirmations',
          'Send service updates, quotes, and job status notifications',
          'Verify provider credentials and conduct background checks',
          'Respond to your questions, comments, and support requests',
          'Send marketing communications (with your consent)',
          'Analyze usage patterns to improve user experience',
          'Detect, prevent, and address fraud and security threats',
          'Comply with legal obligations and resolve disputes',
        ]} />
      </ContentSection>

      <ContentSection title="3. Information Sharing and Disclosure">
        <ContentText className="mb-4">
          We respect your privacy and do not sell your personal information to third parties. We may share your information in the following circumstances:
        </ContentText>
        <ContentText className="font-medium mb-2">With service providers:</ContentText>
        <ContentList items={[
          'Vehicle and service request details shared with mechanics who can fulfill your request',
          'Contact information shared after you accept a quote',
          'Location data to help providers estimate distance and response time',
        ]} />
        <ContentText className="font-medium mb-2 mt-4">With service partners:</ContentText>
        <ContentList items={[
          'Stripe for payment processing (PCI DSS compliant)',
          'Email service providers for transactional notifications',
          'Analytics providers (Google Analytics, Mixpanel) to improve our services',
          'Customer support tools (Intercom, Zendesk)',
        ]} />
        <ContentText className="font-medium mb-2 mt-4">Legal requirements:</ContentText>
        <ContentList items={[
          'Law enforcement when required by court order or subpoena',
          'Regulatory authorities to comply with applicable laws',
          'To protect our rights, property, or safety and that of our users',
        ]} />
      </ContentSection>

      <ContentSection title="4. Data Security and Retention">
        <ContentText className="mb-4">
          We implement industry-standard security measures to protect your data:
        </ContentText>
        <ContentList items={[
          'SSL/TLS encryption for all data transmission',
          'Password hashing using bcrypt',
          'Payment data tokenized and stored by PCI-compliant Stripe',
          'Regular security audits and penetration testing',
          'Access controls and authentication requirements for staff',
        ]} />
        <ContentText className="mt-4">
          We retain your data for as long as your account is active or as needed to provide services. After account deletion, we may retain certain data for legal compliance, fraud prevention, and dispute resolution (typically 7 years for financial records).
        </ContentText>
      </ContentSection>

      <ContentSection title="5. Your Privacy Rights">
        <ContentText className="mb-4">
          You have the following rights regarding your personal data:
        </ContentText>
        <ContentList items={[
          'Access: Request a copy of all personal data we hold about you',
          'Correction: Update or correct inaccurate information',
          'Deletion: Request deletion of your data ("right to be forgotten")',
          'Portability: Export your data in a machine-readable format',
          'Object: Object to processing of your data for marketing purposes',
          'Withdraw consent: Opt-out of marketing communications at any time',
          'Restrict processing: Limit how we use your data in certain circumstances',
        ]} />
        <ContentText className="mt-4">
          To exercise these rights, email us at{' '}
          <a href="mailto:privacy@shanda.com" className="text-slate-900 hover:text-slate-700 hover:underline font-medium">
            privacy@shanda.com
          </a>
          . We will respond within 30 days.
        </ContentText>
      </ContentSection>

      <ContentSection title="6. Cookies and Tracking">
        <ContentText className="mb-4">
          We use cookies and similar technologies to enhance your experience:
        </ContentText>
        <ContentList items={[
          'Essential cookies: Required for platform functionality',
          'Analytics cookies: Help us understand how you use the platform',
          'Marketing cookies: Deliver relevant advertisements (with consent)',
          'Preference cookies: Remember your settings and preferences',
        ]} />
        <ContentText className="mt-4">
          You can control cookies through your browser settings, but this may limit platform functionality.
        </ContentText>
      </ContentSection>

      <ContentSection title="7. Children's Privacy">
        <ContentText>
          Shanda is not intended for use by individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected data from a minor, please contact us immediately.
        </ContentText>
      </ContentSection>

      <ContentSection title="8. Changes to This Policy">
        <ContentText>
          We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. Material changes will be communicated via email or prominent platform notice. The "Last Updated" date at the top indicates when changes were last made.
        </ContentText>
      </ContentSection>

      <ContentSection title="9. Contact Us">
        <ContentText>
          If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, contact us at:
          <br /><br />
          Email: <a href="mailto:privacy@shanda.com" className="text-slate-900 hover:text-slate-700 hover:underline font-medium">
            privacy@shanda.com
          </a>
          <br />
          Mail: Shanda Technologies Inc., 123 Innovation Drive, Toronto, ON M5A 1A1, Canada
        </ContentText>
      </ContentSection>
    </ContentPageLayout>
  );
}
