import React, { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { env } from '@/config/env';
import { useToast } from '@/contexts/ToastContext';
import { validateField, VALIDATION_RULES, getInputClasses, renderError } from '@/shared/utils/validation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';

function formatTime(time?: string): string {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
}

export function Contact() {
  const toast = useToast();
  
  const { data: settings } = useQuery({
    queryKey: ['platform-settings'],
    queryFn: async () => {
      const response = await axios.get(`${env.API_URL}/platform/settings`);
      return response.data;
    },
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    const rules = {
      name: VALIDATION_RULES.name,
      email: VALIDATION_RULES.email,
      subject: { required: 'Please select a subject' },
      message: VALIDATION_RULES.message,
    };
    const error = validateField(formData[field as keyof typeof formData], rules[field as keyof typeof rules]);
    setErrors({ ...errors, [field]: error || '' });
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (touched[field]) {
      handleBlur(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const allTouched = { name: true, email: true, subject: true, message: true };
    setTouched(allTouched);
    
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach((key) => {
      const rules = {
        name: VALIDATION_RULES.name,
        email: VALIDATION_RULES.email,
        subject: { required: 'Please select a subject' },
        message: VALIDATION_RULES.message,
      };
      const error = validateField(formData[key as keyof typeof formData], rules[key as keyof typeof rules]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).some(k => newErrors[k])) return;
    
    setIsSubmitting(true);

    setTimeout(() => {
      toast.success('Message sent! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTouched({});
      setErrors({});
      setIsSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: settings?.contactEmail || 'support@shanda.com',
      link: `mailto:${settings?.contactEmail || 'support@shanda.com'}`,
    },
    {
      icon: '📞',
      title: 'Phone',
      value: settings?.contactPhone || '1-800-SHANDA',
      link: `tel:${settings?.contactPhone || '1-800-742-6321'}`,
    },
    {
      icon: '🕐',
      title: 'Business Hours',
      value: settings?.businessHours?.open && settings?.businessHours?.close
        ? `${formatTime(settings.businessHours.open)} - ${formatTime(settings.businessHours.close)}` 
        : '9:00 AM - 6:00 PM EST',
      link: null,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Contact <span className="text-yellow-500">Us</span>
          </h1>
          <p className="text-lg text-slate-600">We're here to help</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {contactMethods.map((method) => (
            <Card key={method.title}>
              <CardContent className="py-6 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                  {method.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{method.title}</h3>
                {method.link ? (
                  <a href={method.link} className="text-slate-600 hover:text-slate-900 hover:underline">
                    {method.value}
                  </a>
                ) : (
                  <p className="text-slate-600">{method.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className={getInputClasses(!!errors.name)}
                  />
                  {touched.name && renderError(errors.name)}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={getInputClasses(!!errors.email)}
                  />
                  {touched.email && renderError(errors.email)}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                  Subject
                </label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                  onBlur={() => handleBlur('subject')}
                  className={getInputClasses(!!errors.subject)}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="billing">Billing Question</option>
                  <option value="provider">Become a Provider</option>
                  <option value="feedback">Feedback</option>
                </select>
                {touched.subject && renderError(errors.subject)}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  className={getInputClasses(!!errors.message)}
                />
                {touched.message && renderError(errors.message)}
              </div>

              <Button type="submit" size="lg" fullWidth isLoading={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 pt-8 border-t border-slate-300">
          <Link to="/" className="text-slate-900 hover:text-slate-700 hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
