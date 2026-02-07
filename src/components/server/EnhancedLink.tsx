import { Icon } from "@/components/Icon";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import imageLoader from '@/lib/image-loader';
import { loadAndParseMxdFile } from "@/lib/loadAndParseMxdFile";
import { cn } from "@/lib/utils";
import Image from 'next/image';

export async function EnhancedLink({ children, href, className }: { children: React.ReactNode; href: string, className?: string }) {
  if (href.startsWith('/') && href.endsWith('.mdx')) {
    const linkData = await loadAndParseMxdFile({ filepath: href })
    if (linkData) {
      return <HoverCard openDelay={100} closeDelay={200}>
        <HoverCardTrigger asChild>
          <a
            href={href}
            className={cn('transition-colors decoration-primary/60 hover:decoration-primary underline underline-offset-2 decoration-2 group', className)}
          >
            {
              linkData.metadata.coverphoto
                ? <span className="inline-block align-text-bottom me-1 relative w-4 h-4 shrink-0">
                  <Image
                    loader={imageLoader}
                    alt=""
                    src={linkData.metadata.coverphoto}
                    width={16}
                    height={16}
                    className="object-cover w-full h-full"
                  />
                </span>
                : null
            }
            <span>{children || linkData.metadata.title || href}</span>
          </a>
        </HoverCardTrigger>
        <HoverCardContent side="top" align="center" className="flex w-64 flex-col gap-0.5">
          {
            linkData.metadata.coverphoto
              ? <span className="inline-block align-text-bottom mb-3 relative w-16 h-16 shrink-0">
                <Image
                  loader={imageLoader}
                  alt=""
                  src={linkData.metadata.coverphoto}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </span>
              : null
          }
          <div className="font-semibold">{linkData.metadata.title}</div>
          <div>{linkData.metadata.description}</div>
          <div className="text-muted-foreground mt-1 text-xs">
            {href}
          </div>
        </HoverCardContent>
      </HoverCard>
    }
  }

  return <a
    href={href}
    className={cn('transition-colors decoration-primary/60 hover:decoration-primary underline underline-offset-2 decoration-2 group', className)}
    target={href.startsWith('http') ? '_blank' : undefined}
    rel={href.startsWith('http') ? 'noopener noreferrer nofollow' : undefined}
  >
    <span>
      {children || href}
      {href.startsWith('http') ? <Icon name="arrow_outward" size="sm" className="transition-colors align-middle text-primary/60 group-hover:text-primary" /> : null}
    </span>
  </a>
}
