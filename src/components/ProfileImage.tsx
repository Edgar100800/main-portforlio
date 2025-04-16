import * as React from "react";
import { ShineBorder } from "./magicui/shine-border";
import { cn } from "@/lib/utils";

interface ProfileImageProps {
  src: string;
  alt: string;
  className?: string;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  src,
  alt,
  className,
}) => {
  return (
    <div className={cn("relative rounded-2xl overflow-hidden", className)}>
      <div className="absolute inset-0 z-0">
        <ShineBorder
          borderWidth={3}
          duration={8}
          shineColor={["#9333EA", "#3B82F6", "#06B6D4"]}
          className="animate-shine rounded-2xl"
        />
      </div>
      <img
        src={src}
        alt={alt}
        className="relative z-10 rounded-2xl w-full h-full object-cover"
        style={{ padding: "3px" }}
      />
    </div>
  );
};
