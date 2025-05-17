declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  
  interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }
  
  export const Play: FC<IconProps>;
  export const Pause: FC<IconProps>;
  export const SkipForward: FC<IconProps>;
  export const SkipBack: FC<IconProps>;
  export const Volume2: FC<IconProps>;
  export const Shuffle: FC<IconProps>;
  export const Repeat: FC<IconProps>;
  export const Heart: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const Home: FC<IconProps>;
  export const Library: FC<IconProps>;
  export const PlusSquare: FC<IconProps>;
  export const Menu: FC<IconProps>;
  export const ArrowLeft: FC<IconProps>;
  export const VolumeX: FC<IconProps>;
  export const Volume1: FC<IconProps>;
  export const Brain: FC<IconProps>;
  export const X: FC<IconProps>;
  export const Upload: FC<IconProps>;
  export const Smile: FC<IconProps>;
} 