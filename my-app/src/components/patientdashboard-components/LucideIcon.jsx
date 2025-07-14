// src/components/LucideIcon.jsx (Renamed from .js to .jsx)

import React from 'react';
import {
  LayoutDashboard, Users, CreditCard, BarChart, MessageSquare, Bell, Settings, HelpCircle,
  Book, Calendar, LogOut, HeartPulse, Search, Plus, Utensils, DollarSign, Heart, CheckCircle, UserPlus, Circle,
  UserRoundPen
} from 'lucide-react';

const LucideIcon = ({ name, ...props }) => {
  const IconComponent = {
    LayoutDashboard, Users, CreditCard, BarChart, MessageSquare, Bell, Settings, HelpCircle,
    Book, Calendar, LogOut, HeartPulse, Search, Plus, Utensils, DollarSign, Heart, CheckCircle, UserPlus, Circle,
    UserRoundPen
  }[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in lucide-react. Using default 'Circle' icon.`);
    return <Circle {...props} />;
  }

  return <IconComponent {...props} />;
};

export default LucideIcon;