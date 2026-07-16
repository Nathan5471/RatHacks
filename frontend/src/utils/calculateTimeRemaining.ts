export default function calculateTimeRemaining(eventDate: Date) {
  const now = new Date();
  const difference = eventDate.getTime() - now.getTime();

  if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  return { days, hours, minutes, seconds };
}
