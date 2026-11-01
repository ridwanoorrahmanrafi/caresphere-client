export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

export type EventType =
  | "Donation Drive"
  | "Clean-up"
  | "Plantation"
  | "Healthcare"
  | "Education"
  | "Food Relief"
  | "Disaster Relief"
  | "Other";

export interface SocialEvent {
  _id: string;
  title: string;
  description: string;
  eventType: EventType;
  thumbnail: string;
  location: string;
  eventDate: string; // "YYYY-MM-DD" or ISO string
  eventDateIso?: string;
  creatorEmail: string;
  creatorName: string;
  creatorPhoto?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JoinedEvent {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  eventType: EventType;
  thumbnail: string;
  userEmail: string;
  userName: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface Attendee {
  userName: string;
  userEmail: string;
  userPhoto?: string;
  joinedAt: string;
}

export interface EventDetailResponse {
  success: boolean;
  event: SocialEvent;
  attendeesCount: number;
  attendees: Attendee[];
  isUserJoined: boolean;
}
