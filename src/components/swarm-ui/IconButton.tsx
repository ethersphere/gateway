import { createUseStyles } from 'react-jss'
import { ReactElement, CSSProperties, ElementType } from 'react'

const useStyles = createUseStyles({
  common: {
    color: '#303030',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    width: 32,
    height: 32,
    cursor: 'pointer',
    '-moz-user-select': '-moz-none',
    '-khtml-user-select': 'none',
    '-webkit-user-select': 'none',
    '-ms-user-select': 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'none',
    '& svg': {
      fill: '#303030',
      transition: '0.1s',
    },
    '&:hover, &:active': {
      color: 'white',
      backgroundColor: '#dd7200',
      transition: '0.1s',
      '& svg': {
        fill: 'white',
        transition: '0.1s',
      },
    },
  },
  icon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
})

interface Props {
  icon?: ReactElement
  style?: CSSProperties
  onClick?: () => void
  className?: string
  component?: ElementType
}

const IconButton = ({ style, onClick, icon, className, component }: Props): ReactElement => {
  const classes = useStyles()

  const DefaultComponent: ElementType = component || 'div'

  return (
    <DefaultComponent className={`${classes.common} ${className}`} style={style} onClick={onClick}>
      {icon ? <div className={classes.icon}>{icon}</div> : null}
    </DefaultComponent>
  )
}

export default IconButton