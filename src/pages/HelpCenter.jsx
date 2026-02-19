import React from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  HelpCircle,
  KeyRound,
  LifeBuoy,
  Lock,
  Search,
  Settings,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

import SupportContainer from '@/components/support/SupportContainer';
import SupportCard from '@/components/support/SupportCard';
import SupportButton from '@/components/support/SupportButton';
import MotionSection from '@/components/support/MotionSection';
import FaqAccordion from '@/components/support/FaqAccordion';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  {
    id: 'account',
    title: 'Account & Login',
    description: 'Sign in, passwords, profile updates, and account settings.',
    icon: KeyRound,
    keywords: ['account', 'login', 'password', 'sign in', 'profile'],
  },
  {
    id: 'billing',
    title: 'Payments & Billing',
    description: 'Payment methods, invoices, refunds, and billing questions.',
    icon: CreditCard,
    keywords: ['payment', 'billing', 'invoice', 'refund'],
  },
  {
    id: 'technical',
    title: 'Technical Issues',
    description: 'Troubleshooting, performance, errors, and bug reports.',
    icon: Settings,
    keywords: ['error', 'bug', 'issue', 'slow', 'performance'],
  },
  {
    id: 'services',
    title: 'Placements / Services',
    description: 'Questions about services, availability, and delivery details.',
    icon: LifeBuoy,
    keywords: ['service', 'delivery', 'placement', 'availability'],
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    description: 'Data protection, privacy requests, and security best practices.',
    icon: ShieldCheck,
    keywords: ['security', 'privacy', 'data', '2fa', 'gdpr'],
  },
  {
    id: 'general',
    title: 'General Questions',
    description: 'Shipping, returns, policies, and getting started.',
    icon: HelpCircle,
    keywords: ['shipping', 'returns', 'policy', 'getting started'],
  },
];

const FAQS = [
  {
    id: 'reset-password',
    question: 'How do I reset my password?',
    answer:
      'Go to the login page and select “Forgot password”. We’ll email you a secure link to reset it. If you don’t see the email within a few minutes, check your spam folder.',
    tags: ['account', 'login', 'password'],
  },
  {
    id: 'update-email',
    question: 'Can I change the email address on my account?',
    answer:
      'Yes. Open your Profile page, choose Account Settings, and update your email. For security, we may ask you to verify the new email before it becomes active.',
    tags: ['account', 'profile'],
  },
  {
    id: 'refunds',
    question: 'How do refunds work?',
    answer:
      'If your order is eligible for a refund, it will be returned to the original payment method. Refund timing depends on your bank, but it typically appears within 3–10 business days.',
    tags: ['billing', 'payment', 'refund'],
  },
  {
    id: 'invoice',
    question: 'Where can I find my receipts or invoices?',
    answer:
      'You can view order receipts under Orders. Select an order to see the payment summary and downloadable receipt (when available).',
    tags: ['billing', 'invoice', 'orders'],
  },
  {
    id: 'checkout-error',
    question: 'I’m seeing an error at checkout—what should I try first?',
    answer:
      'Try refreshing the page, confirming your payment details, and disabling browser extensions that may block payments. If the issue persists, contact support with the error text and time of occurrence.',
    tags: ['technical', 'checkout', 'payment'],
  },
  {
    id: 'security',
    question: 'How do you keep my data secure?',
    answer:
      'We follow industry-standard security practices, including encrypted transport (HTTPS) and access controls. If you suspect suspicious activity, contact support immediately so we can help secure your account.',
    tags: ['security', 'privacy'],
  },
  {
    id: 'privacy-request',
    question: 'How can I request access or deletion of my data?',
    answer:
      'You can submit a privacy request from the Contact page by selecting “Privacy request”. We’ll guide you through verification and handle the request as quickly as possible.',
    tags: ['privacy', 'security'],
  },
  {
    id: 'order-status',
    question: 'Where can I check my order status?',
    answer:
      'Go to Orders to see current and past purchases. Each order includes the latest status, tracking details (when available), and support options if something looks off.',
    tags: ['orders', 'general'],
  },
];

function normalize(text) {
  return String(text).toLowerCase().trim();
}

export default function HelpCenter() {
  const [query, setQuery] = React.useState('');

  const q = normalize(query);

  const filteredFaqs = React.useMemo(() => {
    if (!q) return FAQS;
    return FAQS.filter((f) => {
      const haystack = normalize(`${f.question} ${f.answer} ${f.tags.join(' ')}`);
      return haystack.includes(q);
    });
  }, [q]);

  const onCategoryClick = (category) => {
    setQuery(category.keywords[0] ?? category.title);
    const el = document.getElementById('help-search');
    if (el) el.focus();
  };

  return (
    <div className="bg-white">
      <SupportContainer>
        <header className="py-10 md:py-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-gray-900">
              How Can We Help You?
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers fast, explore common topics, or reach out if you need a hand.
            </p>

            <div className="mt-7 md:mt-9 max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  aria-hidden="true"
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
                />
                <Input
                  id="help-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search articles, topics, and FAQs…"
                  aria-label="Search help articles"
                  className="h-12 rounded-2xl pl-11 pr-4 shadow-sm ring-1 ring-gray-100 border-transparent focus-visible:ring-2 focus-visible:ring-black/10"
                />
              </div>
            </div>
          </motion.div>
        </header>

        <MotionSection className="pb-10 md:pb-14">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                Help Categories
              </h2>
              <p className="mt-1 text-sm md:text-base text-gray-600">
                Browse by topic to get the fastest answer.
              </p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;

              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  onClick={() => onCategoryClick(cat)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  transition={{ duration: 0.16, ease: 'easeOut' }}
                  className={cn(
                    'text-left rounded-2xl bg-white ring-1 ring-gray-100 shadow-sm p-6 md:p-10 transition-shadow hover:shadow-md',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/10'
                  )}
                  aria-label={`Open ${cat.title} help topics`}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-11 w-11 rounded-2xl bg-gray-50 flex items-center justify-center ring-1 ring-gray-100">
                      <Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-base font-semibold text-gray-900">
                        {cat.title}
                      </div>
                      <p className="mt-1 text-sm text-gray-600 leading-6">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </MotionSection>

        <MotionSection className="pb-10 md:pb-14" as="section">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900" id="faq">
                Frequently Asked Questions
              </h2>
              <p className="mt-1 text-sm md:text-base text-gray-600">
                Clear, straightforward answers to common questions.
              </p>
            </div>
          </div>

          <SupportCard className="mt-6 p-3 md:p-4">
            {filteredFaqs.length ? (
              <FaqAccordion items={filteredFaqs} defaultOpenId={filteredFaqs[0]?.id} />
            ) : (
              <div className="p-6 md:p-10 text-sm text-gray-600">
                No results for “{query}”. Try a different search.
              </div>
            )}
          </SupportCard>
        </MotionSection>

        <MotionSection className="pb-14 md:pb-20">
          <div className="rounded-2xl bg-gray-50 ring-1 ring-gray-100 p-6 md:p-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-white ring-1 ring-gray-100">
              <Lock className="h-5 w-5 text-gray-900" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl md:text-2xl font-semibold text-gray-900">
              Still need help?
            </h2>
            <p className="mt-2 text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
              Contact our support team and we’ll get back to you as soon as we can.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <SupportButton asChild>
                <Link to="/contact" aria-label="Contact support">
                  Contact Support
                </Link>
              </SupportButton>
              <SupportButton
                variant="secondary"
                asChild
              >
                <a href="#faq" aria-label="Jump to FAQ section">
                  View FAQs
                </a>
              </SupportButton>
            </div>
          </div>
        </MotionSection>
      </SupportContainer>
    </div>
  );
}
