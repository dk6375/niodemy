import Link from 'next/link'
import {
  GraduationCap,
  FlaskConical,
  Target,
  Building2,
  Wrench,
  Lightbulb,
  Newspaper,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const segments = [
  {
    name: 'School',
    href: '/school',
    icon: GraduationCap,
    audience: 'Class 1–10',
    desc: 'Board exams, Olympiads, Scholarships & NEET/JEE Foundation.',
    badge: 'Foundation',
  },
  {
    name: 'Senior',
    href: '/senior',
    icon: FlaskConical,
    audience: 'Class 11–12 + NEET/JEE',
    desc: 'Board + Entrance combined. Depth, speed drills, PYQs & detailed QNA.',
    badge: 'Hybrid Course',
    highlight: true,
  },
  {
    name: 'Coaching',
    href: '/coaching',
    icon: Target,
    audience: 'After 12th',
    desc: 'SSC, RRB, Police, Banking, UPSC. Multi-exam combined course.',
    badge: 'Combined Course',
    highlight: true,
  },
  {
    name: 'College',
    href: '/college',
    icon: Building2,
    audience: 'Degree Students',
    desc: 'Semester subjects, practicals & placement prep.',
    badge: 'Coming Soon',
  },
  {
    name: 'ITI',
    href: '/iti',
    icon: Wrench,
    audience: 'Trade Students',
    desc: 'Workshop, practicals, tools & apprenticeship.',
    badge: 'Coming Soon',
  },
  {
    name: 'Skills',
    href: '/skills',
    icon: Lightbulb,
    audience: 'Anyone, Anytime',
    desc: 'Coding, Excel, marketing. W3Schools-style tutorials.',
    badge: 'Tutorials',
  },
  {
    name: 'GK',
    href: '/gk',
    icon: Newspaper,
    audience: 'Everyone',
    desc: 'Daily current affairs, exam-centric & personalized.',
    badge: 'Daily Feed',
  },
  {
    name: 'Atlas',
    href: '/atlas',
    icon: BookOpen,
    audience: 'Reference',
    desc: 'NCERT & state board book solutions. SEO-friendly.',
    badge: 'Free Reference',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <Badge
              variant="secondary"
              className="mb-4 gap-1.5 px-3 py-1 text-xs sm:text-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              India&apos;s Next-Gen Learning Platform
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Learn anything, anytime —
              <span className="block text-primary">
                from Class 1 to Career
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base lg:text-lg">
              8 segments in one platform. Combined courses for multi-goal
              learners. AI tutor, doubt chat & spaced repetition. All content
              free to browse — structured to learn.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/coaching">
                  Explore Combined Course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link href="/signup">Get Started Free</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              No payment. No credit card. Browse everything free.
            </p>
          </div>
        </div>
      </section>

      {/* Segments Grid */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Choose your learning path
          </h2>
          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            8 specialized segments. One account. One learner profile.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {segments.map((seg) => {
            const Icon = seg.icon
            return (
              <Link key={seg.href} href={seg.href} className="group">
                <Card
                  className={`relative h-full overflow-hidden p-5 transition-all hover:shadow-lg ${
                    seg.highlight
                      ? 'border-primary/30 ring-1 ring-primary/20'
                      : ''
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant={seg.highlight ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {seg.badge}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold">{seg.name}</h3>
                  <p className="text-xs font-medium text-primary">
                    {seg.audience}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {seg.desc}
                  </p>
                  <div className="mt-4 flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    Explore
                    <ArrowRight className="ml-1 h-3.5 w-3.5" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              What makes us different
            </h2>
            <p className="mt-2 text-sm text-muted-foreground sm:text-base">
              Features no other Indian learning platform offers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Combined Course Engine',
                desc: 'Multiple exams → ONE optimized course. RRB + SSC + Police in one path. Board + NEET in one path.',
              },
              {
                title: 'Depth-Layered Content',
                desc: 'Same concept taught at different depths. Class 8 sees L1, NEET aspirant sees L4. No duplicate content.',
              },
              {
                title: 'W3Schools-Style Free Access',
                desc: 'Browse everything free. No login wall. Enrollment adds structure, not access.',
              },
              {
                title: 'Unified Chat System',
                desc: 'One chat for doubts, AI tutor, live classes & QNA forum. Not four separate systems.',
              },
              {
                title: 'Cross-Segment Mastery',
                desc: 'Mastered Photosynthesis in Class 8? Counts toward NEET. One continuous journey.',
              },
              {
                title: 'AI Study Companion',
                desc: 'Personal AI tutor that knows your progress, weak areas & learning style.',
              },
            ].map((feat) => (
              <Card key={feat.title} className="p-5">
                <h3 className="mb-2 text-base font-semibold">{feat.title}</h3>
                <p className="text-sm text-muted-foreground">{feat.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-12 sm:px-6 sm:py-16">
          <Card className="overflow-hidden bg-primary p-8 text-primary-foreground sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold sm:text-3xl">
                Ready to start learning?
              </h2>
              <p className="mt-2 text-sm text-primary-foreground/80 sm:text-base">
                Browse content free. Create an account for structured learning,
                progress tracking & AI tutor.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <Link href="/signup">Create Free Account</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
                >
                  <Link href="/coaching">See Combined Course Demo</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
