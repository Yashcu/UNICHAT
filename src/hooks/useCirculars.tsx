import { useState } from 'react';
import { Circular, User } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Admin User',
    email: 'admin@university.edu',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-2',
    name: 'Dr. Sarah Johnson',
    email: 'sarah@university.edu',
    role: 'faculty',
    createdAt: new Date().toISOString(),
  },
];

const mockCirculars: Circular[] = [
  {
    id: 'circular-1',
    title: 'Fall Semester 2025 Registration Dates',
    content: `Dear Students,

Registration for the Fall 2025 semester will open according to the following schedule:

Seniors (90+ credits): April 5, 2025
Juniors (60-89 credits): April 7, 2025
Sophomores (30-59 credits): April 9, 2025
Freshmen (0-29 credits): April 11, 2025

Please ensure that you have met with your academic advisor and resolved any holds on your account before your registration date.

The course catalog will be available online starting March 25, 2025.

Best regards,
Office of the Registrar`,
    summary: 'Fall 2025 registration opens April 5-11 based on class standing. Meet with advisors and check for holds beforehand. Course catalog available March 25.',
    postedBy: mockUsers[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
  },
  {
    id: 'circular-2',
    title: 'Campus Housing Application Deadline',
    content: `Important Notice: Campus Housing Applications

The deadline for campus housing applications for the upcoming academic year is May 15, 2025.

All returning students must complete the online housing application form available on the student portal. First-year students will receive separate instructions via email.

Please note:
- A $200 housing deposit is required with your application
- Room selection for returning students will begin on June 1, 2025
- Roommate requests must be mutual and submitted by both parties
- Special accommodation requests require documentation from Disability Services

Housing assignments will be finalized by July 15, 2025.

If you have any questions, please contact the Housing Office at housing@university.edu.

Thank you,
Campus Housing Department`,
    summary: 'Campus housing applications for next year are due May 15, 2025. $200 deposit required. Room selection starts June 1 for returning students. Final assignments by July 15.',
    postedBy: mockUsers[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
  {
    id: 'circular-3',
    title: 'Changes to Physics Department Office Hours',
    content: `Announcement from the Physics Department

Effective immediately, the Physics Department office hours have been updated as follows:

Monday - Thursday: 9:00 AM - 4:30 PM
Friday: 9:00 AM - 3:00 PM
Saturday - Sunday: Closed

Faculty office hours remain unchanged and can be found on individual faculty profile pages on the department website.

For urgent matters outside of regular hours, please email physics@university.edu.

Dr. Robert Chen
Chair, Department of Physics`,
    summary: 'Physics Department has new office hours: Mon-Thu 9:00-4:30, Fri 9:00-3:00, closed weekends. Faculty hours unchanged. Contact physics@university.edu for urgent matters.',
    postedBy: mockUsers[1],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
  },
  {
    id: 'circular-4',
    title: 'Library Extended Hours During Finals Week',
    content: `Finals Week Library Hours

To support students during finals week (May 10-14, 2025), the University Library will extend its operating hours as follows:

Monday - Thursday: 7:00 AM - 2:00 AM
Friday: 7:00 AM - 12:00 AM
Saturday: 9:00 AM - 12:00 AM
Sunday: 9:00 AM - 2:00 AM

Additional services during finals week:
- Free coffee and tea service from 8:00 PM to midnight
- Extra study rooms available (reserve online)
- Tech support available until 10:00 PM
- Stress relief activities in the lobby

Regular library hours will resume on May 15, 2025.

Good luck with your finals!
University Library Staff`,
    summary: 'Library extends hours during finals week (May 10-14): 7AM-2AM Mon-Thu, 7AM-12AM Fri, 9AM-12AM Sat, 9AM-2AM Sun. Free coffee and extra study rooms available.',
    postedBy: mockUsers[0],
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
];

export const useCirculars = () => {
  const [circulars, setCirculars] = useState<Circular[]>(mockCirculars);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);

  const addCircular = (circular: Circular) => {
    setCirculars(prev => [circular, ...prev]);
  };

  return {
    circulars,
    selectedCircular,
    selectCircular: setSelectedCircular,
    addCircular,
  };
};