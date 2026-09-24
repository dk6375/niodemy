import Link from 'next/link'
import { GraduationCap } from 'lucide-react'

const footerLinks = [
  {
    title: 'Segments',
    links: [
      { name: 'School', href: '/school' },
      { name: 'Senior', href: '/senior' },
      { name: 'Coaching', href: '/coaching' },
      { name: 'College', href: '/college' },
      { name: 'ITI', href: '/iti' },
      { name: 'Skills', href: '/skills' },
      { name: 'GK', href: '/gk' },
      { name: 'Atlas', href: '/atlas' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { name: 'Dashboard', href: '/my' },
      { name: 'Login', href: '/login' },
      { name: 'Sign Up', href: '/signup' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="text-lg">Niodemy</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              India&apos;s next-gen learning platform. Learn anything, anytime —
              free to browse, structured to learn.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} Niodemy by SnapZila Academy. All
            content free to browse. Built with ❤️ for India&apos;s learners.
          </p>
        </div>
      </div>
    </footer>
  )
}
