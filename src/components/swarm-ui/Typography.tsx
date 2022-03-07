import { createUseStyles } from 'react-jss'
import type { ReactElement, ReactNode, CSSProperties, ElementType } from 'react'

import { colors } from './css'

const useStyles = createUseStyles({
  common: {
    color: colors.text.normal,
    fontFamily: 'iAWriterQuattroV',
    fontWeight: 500,
    fontStretch: 'normal',
    fontStyle: 'normal',
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
  },
  body: {
    fontSize: 16,
  },
  caption: {
    color: colors.text.caption,
    fontSize: 14,
    fontStyle: 'italic',
  },
  button: {
    fontSize: 14,
  },
  code: {
    fontFamily: 'iAWriterMonoV',
    fontSize: 14,
  },
  link: {
    fontSize: 14,
    textDecoration: 'underline',
    color: colors.text.caption,
  },
  sizeSmall: {
    fontSize: 14,
  },
  sizeMedium: {
    fontSize: 16,
  },
  sizeLarge: {
    fontSize: 18,
  },
})

interface Props {
  variant?: 'body' | 'button' | 'caption' | 'code' | 'link' | 'title'
  size?: 'small' | 'medium' | 'large'
  children?: ReactNode
  style?: CSSProperties
  className?: string
  component?: ElementType
}

const Typography = ({ variant, children, style, size, className }: Props): ReactElement => {
  const classes = useStyles()

  let variantClass = classes.body

  if (variant === 'button') variantClass = classes.button
  else if (variant === 'caption') variantClass = classes.caption
  else if (variant === 'code') variantClass = classes.code
  else if (variant === 'link') variantClass = classes.link
  else if (variant === 'title') variantClass = classes.title

  let sizeClass = ''

  if (size === 'small') sizeClass = classes.sizeSmall
  else if (size === 'medium') sizeClass = classes.sizeMedium
  else if (size === 'large') sizeClass = classes.sizeLarge

  return (
    <span style={style} className={`${classes.common} ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  )
}

export default Typography
