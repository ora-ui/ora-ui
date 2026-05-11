import { Avatar, AvatarImage, AvatarFallback } from '@/registry/ui/avatar';

export function AvatarDefault() {
  return (
    <Avatar>
      <AvatarImage
        src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
        alt="User avatar"
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  );
}

export default AvatarDefault;

export function AvatarSm() {
  return (
    <Avatar size="sm">
      <AvatarImage
        src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
        alt="User avatar"
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  );
}

export function AvatarLg() {
  return (
    <Avatar size="lg">
      <AvatarImage
        src="https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80"
        alt="User avatar"
      />
      <AvatarFallback>AB</AvatarFallback>
    </Avatar>
  );
}
