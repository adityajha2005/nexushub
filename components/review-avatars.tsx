import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ReviewAvatars() {
  return (
    <div className="flex -space-x-2">
      <Avatar className="border-2 border-white">
        <AvatarImage src="/placeholder.svg" alt="Reviewer 1" />
        <AvatarFallback>R1</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="/placeholder.svg" alt="Reviewer 2" />
        <AvatarFallback>R2</AvatarFallback>
      </Avatar>
      <Avatar className="border-2 border-white">
        <AvatarImage src="/placeholder.svg" alt="Reviewer 3" />
        <AvatarFallback>R3</AvatarFallback>
      </Avatar>
    </div>
  )
}

