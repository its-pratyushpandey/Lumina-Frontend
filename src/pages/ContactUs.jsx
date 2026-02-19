import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import {
  Clock,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';

import SupportContainer from '@/components/support/SupportContainer';
import SupportCard from '@/components/support/SupportCard';
import SupportButton from '@/components/support/SupportButton';
import MotionSection from '@/components/support/MotionSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';

const SUBJECTS = [
  { value: 'general', label: 'General question' },
  { value: 'order', label: 'Order support' },
  { value: 'billing', label: 'Billing & payments' },
  { value: 'technical', label: 'Technical issue' },
  { value: 'privacy', label: 'Privacy request' },
];

const schema = z.object({
  fullName: z.string().min(1, 'Full name is required.'),
  email: z.string().min(1, 'Email is required.').email('Enter a valid email.'),
  subject: z.string().min(1, 'Please select a subject.'),
  message: z.string().min(10, 'Message must be at least 10 characters.'),
  attachment: z
    .any()
    .optional()
    .refine(
      (v) => {
        if (!v) return true;
        if (!(v instanceof FileList)) return true;
        if (v.length === 0) return true;
        const f = v.item(0);
        return !f ? true : f.size <= 10 * 1024 * 1024;
      },
      { message: 'Attachment must be 10MB or smaller.' }
    ),
});

export default function ContactUs() {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: '',
      email: '',
      subject: 'general',
      message: '',
      attachment: undefined,
    },
    mode: 'onTouched',
  });

  const onSubmit = async (_values) => {
    await new Promise((r) => setTimeout(r, 700));

    toast({
      title: 'Message sent',
      description: 'Thanks — our team will reach out shortly.',
    });

    reset({
      fullName: '',
      email: '',
      subject: 'general',
      message: '',
      attachment: undefined,
    });
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
              Contact Our Team
            </h1>
            <p className="mt-3 text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              We’re here to help. Send us a message and we’ll respond as soon as possible.
            </p>
          </motion.div>
        </header>

        <MotionSection className="pb-14 md:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SupportCard className="p-6 md:p-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Prefer email or phone? Reach us directly.
              </p>

              <div className="mt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-gray-900" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Email</div>
                    <a
                      className="text-sm text-gray-600 hover:text-gray-900"
                      href="mailto:support@lumina.example"
                      aria-label="Email support"
                    >
                      support@lumina.example
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-gray-900" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Phone</div>
                    <a
                      className="text-sm text-gray-600 hover:text-gray-900"
                      href="tel:+15551234567"
                      aria-label="Call support"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-900" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Office hours</div>
                    <div className="text-sm text-gray-600">Mon–Fri, 9:00–17:00</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-900" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Office</div>
                    <div className="text-sm text-gray-600">Remote-first • Global</div>
                  </div>
                </div>
              </div>
            </SupportCard>

            <SupportCard className="p-6 md:p-10">
              <h2 className="text-xl font-semibold text-gray-900">Send a message</h2>
              <p className="mt-2 text-sm md:text-base text-gray-600">
                Share a bit of context so we can help faster.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-5"
                aria-label="Contact form"
                noValidate
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      autoComplete="name"
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      className="mt-2 rounded-2xl"
                      {...register('fullName')}
                    />
                    {errors.fullName ? (
                      <p id="fullName-error" className="mt-2 text-sm text-red-600">
                        {String(errors.fullName.message)}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                      className="mt-2 rounded-2xl"
                      {...register('email')}
                    />
                    {errors.email ? (
                      <p id="email-error" className="mt-2 text-sm text-red-600">
                        {String(errors.email.message)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Controller
                    control={control}
                    name="subject"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger
                          id="subject"
                          aria-invalid={Boolean(errors.subject)}
                          aria-describedby={errors.subject ? 'subject-error' : undefined}
                          className="mt-2 rounded-2xl"
                        >
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUBJECTS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.subject ? (
                    <p id="subject-error" className="mt-2 text-sm text-red-600">
                      {String(errors.subject.message)}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                    className="mt-2 rounded-2xl"
                    {...register('message')}
                  />
                  {errors.message ? (
                    <p id="message-error" className="mt-2 text-sm text-red-600">
                      {String(errors.message.message)}
                    </p>
                  ) : null}
                </div>

                <div>
                  <Label htmlFor="attachment">Attachment (optional)</Label>
                  <Input
                    id="attachment"
                    type="file"
                    aria-invalid={Boolean(errors.attachment)}
                    aria-describedby={errors.attachment ? 'attachment-error' : undefined}
                    className="mt-2 rounded-2xl"
                    {...register('attachment')}
                  />
                  {errors.attachment ? (
                    <p id="attachment-error" className="mt-2 text-sm text-red-600">
                      {String(errors.attachment.message)}
                    </p>
                  ) : (
                    <p className="mt-2 text-xs text-gray-500">Max file size: 10MB</p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <SupportButton type="submit" disabled={isSubmitting} aria-label="Submit contact form">
                    {isSubmitting ? 'Sending…' : 'Submit'}
                  </SupportButton>
                  <SupportButton
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => reset()}
                    aria-label="Clear contact form"
                  >
                    Clear
                  </SupportButton>
                </div>

                <div className="pt-2">
                  <div className="flex items-center gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Visit our Twitter"
                      className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                    >
                      <Twitter className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Visit our LinkedIn"
                      className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                    >
                      <Linkedin className="h-5 w-5" aria-hidden="true" />
                    </a>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Visit our GitHub"
                      className="h-10 w-10 rounded-2xl bg-gray-50 ring-1 ring-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
                    >
                      <Github className="h-5 w-5" aria-hidden="true" />
                    </a>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-gray-500">
                    By submitting this form, you agree that we may use your information to
                    respond to your request. Please avoid sharing sensitive data.
                  </p>
                </div>
              </form>
            </SupportCard>
          </div>
        </MotionSection>
      </SupportContainer>
    </div>
  );
}
