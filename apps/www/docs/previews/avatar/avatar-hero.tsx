import { Avatar, AvatarImage, AvatarFallback } from '@/registry/ui/avatar';

export default function AvatarHero() {
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage
          src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
          alt="User avatar"
        />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    </div>
  );
}
