import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/registry/ui/avatar';

const SRC = 'https://images.unsplash.com/photo-1729552958114-f9fe2e585476?w=128&h=128&dpr=2&q=80';

export default function AvatarGroupPreview() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src={SRC} alt="User avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={SRC} alt="User avatar" />
        <AvatarFallback>CD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src={SRC} alt="User avatar" />
        <AvatarFallback>EF</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+5</AvatarGroupCount>
    </AvatarGroup>
  );
}
