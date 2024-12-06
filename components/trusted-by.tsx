import Image from "next/image"

export function TrustedBy() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <h2 className="text-center text-xl font-semibold mb-8">Trusted by world class creators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-center opacity-75">
          <Image src="/placeholder.svg" alt="AutoSpeed" width={150} height={50} className="mx-auto" />
          <Image src="/placeholder.svg" alt="BeautyBox" width={150} height={50} className="mx-auto" />
          <Image src="/placeholder.svg" alt="Blinds" width={150} height={50} className="mx-auto" />
          <Image src="/placeholder.svg" alt="Accountants" width={150} height={50} className="mx-auto" />
        </div>
      </div>
    </section>
  )
}

