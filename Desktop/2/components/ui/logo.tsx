import Link from 'next/link'

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link className="block" href="/">
      <span className="ml-2 text-lg font-bold">Logo Area</span>
      </Link>
      <span className="ml-2 text-lg font-bold">Apollo</span>
    </div>
  )
}
