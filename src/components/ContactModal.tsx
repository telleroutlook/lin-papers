import React, { useState } from 'react';
import { AuthorProfile } from '../types/paper';
import { X, Mail, Check, Send } from 'lucide-react';

interface ContactModalProps {
  author: AuthorProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ author, isOpen, onClose }) => {
  const [topic, setTopic] = useState('Research Collaboration');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
    }, 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-surface rounded-xl border border-theme shadow-2xl max-w-lg w-full p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-mono text-muted-readable uppercase tracking-wider font-bold">
              <Mail className="w-3.5 h-3.5 opacity-80" />
              <span>Academic Inquiries</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-title leading-snug">
              Connect with {author.name}
            </h3>
            <p className="text-xs text-body-high">
              For research visits, joint lab grants, keynote talks, or prospective advising.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-title hover:opacity-75 bg-surface-subtle rounded-md transition-colors min-h-[38px] min-w-[38px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-editorial text-lg font-bold text-title">Message Dispatched</h4>
            <p className="text-xs text-body-high max-w-xs mx-auto">
              Thank you for reaching out. Your academic inquiry will be answered within 2–3 business days.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-title mb-1">
                Inquiry Nature
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-surface-subtle border border-theme-strong rounded-lg text-title font-medium focus:outline-none focus:ring-1 focus:ring-theme-strong"
              >
                <option value="Research Collaboration">Research Collaboration & Joint Papers</option>
                <option value="Keynote / Seminar Invitation">Keynote / Seminar Invitation</option>
                <option value="Prospective Student / Postdoc">Prospective PhD / Postdoctoral Applicant</option>
                <option value="Code / Dataset Reproduction">Code Repository / Dataset Inquiry</option>
                <option value="General Academic Question">General Academic Exchange</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-title mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Prof. / Dr. / Ms. Name"
                  className="w-full px-3 py-2 text-xs bg-surface-subtle border border-theme-strong rounded-lg text-title font-medium focus:outline-none focus:ring-1 focus:ring-theme-strong"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-title mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full px-3 py-2 text-xs bg-surface-subtle border border-theme-strong rounded-lg text-title font-medium focus:outline-none focus:ring-1 focus:ring-theme-strong"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-title mb-1">
                Affiliation / Lab
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Stanford AI Lab / Cambridge CS"
                className="w-full px-3 py-2 text-xs bg-surface-subtle border border-theme-strong rounded-lg text-title font-medium focus:outline-none focus:ring-1 focus:ring-theme-strong"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-title mb-1">
                Brief Proposal or Message
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Include paper titles, proposal summary, or prospective research timelines..."
                className="w-full px-3 py-2 text-xs bg-surface-subtle border border-theme-strong rounded-lg text-title font-medium focus:outline-none focus:ring-1 focus:ring-theme-strong"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] text-muted-readable font-mono">
                Direct: <code className="font-bold text-title">{author.email}</code>
              </span>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg shadow-xs min-h-[40px]"
                style={{ backgroundColor: 'var(--text-title)', color: 'var(--canvas-bg)' }}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Dispatch</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
