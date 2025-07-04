export type RsvpStatus = 'pending' | 'confirmed' | 'declined';

export interface Attendee {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  rsvp_status: RsvpStatus;
  dietary_restrictions: string | null;
  needs_accommodation: boolean;
  accommodation_notes: string | null;
  has_plus_one: boolean;
  plus_one_name: string | null;
  plus_one_dietary_restrictions: string | null;
  plus_one_rsvp_status: RsvpStatus | null;
  table_id: string | null;
  invitation_token: string | null;
  created_at: string;
  updated_at: string;
}
