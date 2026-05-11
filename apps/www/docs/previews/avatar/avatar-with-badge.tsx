import { Avatar, AvatarImage, AvatarFallback, AvatarBadge } from '@/registry/ui/avatar';

export default function AvatarWithBadge() {
  return (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
        alt="User avatar"
      />
      <AvatarFallback>AB</AvatarFallback>
      <AvatarBadge className="bg-success-700" />
    </Avatar>
  );
}
