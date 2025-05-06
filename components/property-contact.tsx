'use client';

import { useState } from 'react';
import { Phone, Mail, Building, User, MessageSquare, Calendar } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
}

interface PropertyContactProps {
  agent?: Agent;
  propertyId: string;
  propertyTitle: string;
}

export function PropertyContact({ agent, propertyId, propertyTitle }: PropertyContactProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(`I'm interested in this property (ID: ${propertyId})`);
  const [submitted, setSubmitted] = useState(false);

  if (!agent) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', { name, email, message });
    // In a real app, you would send this data to your backend
    setSubmitted(true);

    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setEmail('');
      setMessage(`I'm interested in this property (ID: ${propertyId})`);
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* Agent Info Section */}
      <div className="bg-rose-50 p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-900">Contact Agent</h2>

        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-rose-600 font-semibold text-xl">
              {agent.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold text-lg text-gray-900">{agent.name}</p>
            <p className="text-gray-600">{agent.company}</p>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <a
            href={`tel:${agent.phone}`}
            className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Phone className="h-5 w-5 text-rose-500" />
            <span className="text-gray-800">{agent.phone}</span>
          </a>

          <a
            href={`mailto:${agent.email}?subject=Inquiry about Property ${propertyId}: ${propertyTitle}`}
            className="flex items-center gap-3 p-2 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Mail className="h-5 w-5 text-rose-500" />
            <span className="text-gray-800">{agent.email}</span>
          </a>

          <div className="flex items-center gap-3 p-2 bg-white rounded-lg">
            <Building className="h-5 w-5 text-rose-500" />
            <span className="text-gray-800">{agent.company}</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <a
            href={`tel:${agent.phone}`}
            className="bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex-1 text-center"
          >
            Call Now
          </a>
          <span className="px-2">or</span>
          <a
            href={`mailto:${agent.email}?subject=Inquiry about Property ${propertyId}: ${propertyTitle}`}
            className="bg-white text-rose-600 border border-rose-600 py-2 px-4 rounded-lg hover:bg-rose-50 transition-colors flex-1 text-center"
          >
            Email
          </a>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Send a Message</h3>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg">
            <p className="font-medium">Message sent successfully!</p>
            <p className="text-sm">We'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MessageSquare className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  rows={4}
                  placeholder="Your message"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 text-white py-2 px-4 rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule a Viewing
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
