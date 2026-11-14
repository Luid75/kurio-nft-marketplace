import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva('ui-button', {
  variants: {
    variant: { primary: 'ui-button-primary', outline: 'ui-button-outline', ghost: 'ui-button-ghost' },
    size: { default: 'ui-button-default', sm: 'ui-button-sm' },
  },
  defaultVariants: { variant: 'primary', size: 'default' },
})
type Props = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>
export const Button = forwardRef<HTMLButtonElement, Props>(({ className, variant, size, ...props }, ref) => (
  <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
))
Button.displayName = 'Button'
