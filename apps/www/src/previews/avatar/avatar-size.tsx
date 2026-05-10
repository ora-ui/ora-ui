import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export function Default() {
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

export default Default;

export function Sm() {
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

export function Lg() {
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
