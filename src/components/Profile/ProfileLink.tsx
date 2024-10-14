import React from "react";
import Image from "next/image";

interface ProfileLinkProps {
  href: string;
  text: string;
}

export const ProfileLink: React.FC<ProfileLinkProps> = ({ href, text }) => (
  <div className="w-full flex flex-row justify-between border-b border-black my-2 pb-4">
    <a href={href}>{text}</a>
    <Image className="ml-2" width={6} height={6} alt="" src="/images/icons/arrowL.svg" />
  </div>
);
