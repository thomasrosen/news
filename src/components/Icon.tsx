import { cn } from '@/lib/utils'
import '@fontsource-variable/material-symbols-sharp'

export function MaterialIconStyle() {
  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: we know the code is safe
      dangerouslySetInnerHTML={{
        __html: `.iconframe:before {
            content: attr(data-name);
            font-family: "Material Symbols Sharp Variable";
            color: inherit;
            font-size: inherit;
            line-height: none;
          }`.replace(/^(\s+)/gm, ''),
      }}
    />
  )
}

export type IconProps = {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  className?: string
  wght?: number
}

export function getIconSize(size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto') {
  const iconSizes: Record<string, string> = {
    sm: 'h-3 w-3 text-base',
    md: 'h-6 w-6 text-2xl',
    lg: 'h-8 w-8 text-3xl',
    xl: 'h-10 w-10 text-4xl',
    auto: 'h-4 w-4 text-base @xs/main:h-6 @xs/main:w-6 @xs/main:text-2xl',
  }

  return size && iconSizes[size] ? iconSizes[size] : iconSizes.md
}

export function Icon({ name, ...props }: IconProps) {
  if (name === 'loading') {
    name = 'progress_activity'
  }

  // per default use the material icon component as a fallback
  return <MaterialIcon name={name} {...props} />
}

export function MaterialIcon({ name, className, size = 'md', wght, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'iconframe',
        'inline-flex shrink-0 items-center justify-center overflow-hidden leading-none',
        getIconSize(size),
        className
      )}
      data-name={name}
      style={{
        fontVariationSettings:
          size === 'sm'
            ? `"FILL" 0, "wght" ${wght || 500}, "GRAD" 0, "opsz" 24` // sm
            : `"FILL" 0, "wght" ${wght || 400}, "GRAD" 0, "opsz" 24`, // md / lg
      }}
      {...props}
    />
  )
}
