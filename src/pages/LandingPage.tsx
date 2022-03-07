import { ReactElement } from 'react'
import { createUseStyles } from 'react-jss'
import Divider from '@material-ui/core/Divider'
import { UploadLine, DownloadLine } from '../components/swarm-ui/icons'
import { useNavigate } from 'react-router-dom'
import * as ROUTES from '../Routes'

import { Typography, Button, Link } from '../components/swarm-ui'

import Layout from '../components/Layout'
import Logo from '../components/Logo'
import Header from '../components/Header'

import text from '../translations'

const useStyles = createUseStyles({
  spread: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  spreadItems: {
    cursor: 'pointer',
    marginLeft: 8,
    marginRight: 8,
  },
})

const LandingPage = (): ReactElement => {
  const classes = useStyles()
  const navigate = useNavigate()

  return (
    <Layout
      top={[
        <Header key="top1">
          <Logo />
        </Header>,
        <Typography key="top2" variant="body">
          {text.landingPage.tagline}
        </Typography>,
      ]}
      center={[
        <div key="center1" style={{ display: 'flex', flexFlow: 'row' }}>
          <Button
            style={{ flexBasis: 100, flexGrow: 1, marginRight: 8 }}
            variant="primary"
            onClick={() => navigate(ROUTES.SHARE)}
            icon={<UploadLine />}
          >
            {text.landingPage.shareAction}
          </Button>
          <Button
            style={{ flexBasis: 100, flexGrow: 1 }}
            variant="primary"
            onClick={() => navigate(ROUTES.ACCESS)}
            icon={<DownloadLine />}
          >
            {text.landingPage.accessAction}
          </Button>
        </div>,
      ]}
      bottom={[
        <Typography key="bottom1" variant="caption">
          {text.landingPage.disclaimer}
        </Typography>,
        <Divider key="bottom2" variant="middle" />,
        <small key="bottom3" className={classes.spread}>
          {text.landingPage.links.map(({ label, link, internal }) => {
            let action: { href: string } | { onClick: () => void } = { href: link }

            if (internal) action = { onClick: () => navigate(link) }

            return (
              <Link key={label} className={classes.spreadItems} target="blank" {...action}>
                {label}
              </Link>
            )
          })}
        </small>,
      ]}
    />
  )
}

export default LandingPage
