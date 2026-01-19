import { motion } from 'framer-motion';

export function HowItWorksSection() {
  const steps = [
    {
      icon: '📝',
      title: 'Post Your Request',
      description: 'Tell us about your car and what service you need. Takes less than 2 minutes.',
    },
    {
      icon: '💬',
      title: 'Get Competing Quotes',
      description: 'Verified mechanics send you quotes. Compare prices, reviews, and availability.',
    },
    {
      icon: '✅',
      title: 'Choose & Book',
      description: 'Pick the best offer and book directly. No hidden fees or surprises.',
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get fair pricing in three simple steps. No dealer markups. No surprise fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, ease: 'easeOut', delay: idx * 0.1 }}
              className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
