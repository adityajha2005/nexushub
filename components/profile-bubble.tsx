import Image from "next/image"

interface ProfileBubbleProps {
  imageSrc: string
  className?: string
}

export function ProfileBubble({ imageSrc, className = "" }: ProfileBubbleProps) {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <Image
        src={imageSrc}
        alt="Profile"
        width={80}
        height={80}
        className="w-full h-full object-cover"
      />
    </div>
  )
}

