'use client';

import { Phone, Mail, Building } from 'lucide-react';

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
  if (!agent) {
    return null;
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Contact Agent</h2>
      
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold text-lg">
              {agent.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="font-semibold">{agent.name}</p>
            <p className="text-sm text-gray-600">{agent.company}</p>
          </div>
        </div>
        
        <div className="pt-2 space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <a href={`tel:${agent.phone}`} className="text-blue-600 hover:underline">
              {agent.phone}
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <a href={`mailto:${agent.email}?subject=Inquiry about Property ${propertyId}: ${propertyTitle}`} className="text-blue-600 hover:underline">
              {agent.email}
            </a>
          </div>
          
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600" />
            <span>{agent.company}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
