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
    <div className={cn("profile-image-shell relative isolate rounded-2xl", className)}>
      <div className="profile-image-aura profile-image-aura-primary" aria-hidden="true" />
      <div className="profile-image-aura profile-image-aura-secondary" aria-hidden="true" />

      <div className="profile-image-frame relative z-10 h-full overflow-hidden rounded-2xl">
        <div className="absolute inset-0 z-0">
          <ShineBorder
            borderWidth={5}
            duration={8}
            shineColor={["#9333EA", "#3B82F6", "#06B6D4"]}
            className="animate-shine rounded-2xl"
          />
        </div>
        <img
          src={src}
          alt={alt}
          className="relative z-10 h-full w-full rounded-2xl object-cover"
          style={{ padding: "5px" }}
        />
      </div>
    </div>
  );
};
