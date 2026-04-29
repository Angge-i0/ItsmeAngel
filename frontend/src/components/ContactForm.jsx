import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { messagesAPI } from '../lib/api';

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await messagesAPI.send(data);
      toast.success('Message sent! I\'ll get back to you soon 🚀');
      reset();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputErr = (name) => errors[name]?.message;

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass p-8 rounded-2xl space-y-5 max-w-lg w-full"
      noValidate
    >
      <h3 className="font-display font-semibold text-xl text-white">Send a Message</h3>

      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="input-label">Name</label>
        <input
          id="contact-name"
          type="text"
          placeholder="Your full name"
          className={`input-field ${inputErr('name') ? 'border-red-500' : ''}`}
          {...register('name', {
            required: 'Name is required',
            minLength: { value: 2, message: 'At least 2 characters' },
            maxLength: { value: 100, message: 'Max 100 characters' },
          })}
        />
        {inputErr('name') && <p className="text-red-400 text-xs mt-1">{inputErr('name')}</p>}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="input-label">Email</label>
        <input
          id="contact-email"
          type="email"
          placeholder="you@example.com"
          className={`input-field ${inputErr('email') ? 'border-red-500' : ''}`}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' },
          })}
        />
        {inputErr('email') && <p className="text-red-400 text-xs mt-1">{inputErr('email')}</p>}
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="contact-subject" className="input-label">Subject</label>
        <input
          id="contact-subject"
          type="text"
          placeholder="What's this about?"
          className={`input-field ${inputErr('subject') ? 'border-red-500' : ''}`}
          {...register('subject', {
            required: 'Subject is required',
            maxLength: { value: 200, message: 'Max 200 characters' },
          })}
        />
        {inputErr('subject') && <p className="text-red-400 text-xs mt-1">{inputErr('subject')}</p>}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="input-label">Message</label>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="Tell me about your project or opportunity..."
          className={`input-field resize-none ${inputErr('message') ? 'border-red-500' : ''}`}
          {...register('message', {
            required: 'Message is required',
            minLength: { value: 10, message: 'At least 10 characters' },
            maxLength: { value: 2000, message: 'Max 2000 characters' },
          })}
        />
        {inputErr('message') && <p className="text-red-400 text-xs mt-1">{inputErr('message')}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center"
        id="contact-submit-btn"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending…
          </span>
        ) : (
          <>
            <PaperAirplaneIcon className="w-4 h-4" />
            Send Message
          </>
        )}
      </button>
    </motion.form>
  );
}
