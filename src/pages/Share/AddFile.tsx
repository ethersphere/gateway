import { ReactElement, useState, DragEvent } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import { ArrowLeft, Plus } from 'react-feather'
import { useHistory } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

import Header from '../../components/Header'
import Layout from '../../components/Layout'

import * as ROUTES from '../../Routes'

interface Props {
  setFile: (file: File | null) => void
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
    },
    dragOverlay: {
      width: '100vw',
      height: '100vh',
      backgroundColor: theme.palette.primary.main,
      zIndex: 150,
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    dragOverlayChildren: {
      margin: theme.spacing(2),
      color: 'white',
    },
  }),
)

export default function Upload({ setFile }: Props): ReactElement | null {
  const classes = useStyles()
  const history = useHistory()
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const onDragOver = (ev: DragEvent<HTMLDivElement>) => {
    setIsDragging(true)

    ev.preventDefault()
  }

  const onDrop = (ev: DragEvent<HTMLDivElement>) => {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault()

    if (ev.dataTransfer.items) {
      const fls = []
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          const fl = ev.dataTransfer.items[i].getAsFile()

          if (fl) fls.push(fl)
        }
      }

      if (fls.length === 1) setFile(fls[0])
    } else {
      // Use DataTransfer interface to access the file(s)
      if (ev.dataTransfer.files.length === 1) setFile(ev.dataTransfer.files[0])
    }
    setIsDragging(false)
  }

  const onDragLeave = (ev: DragEvent<HTMLDivElement>) => {
    setIsDragging(false)

    ev.preventDefault()
  }

  return (
    <div onDragOver={onDragOver} onDrop={onDrop}>
      <>
        {isDragging && (
          <div onDragLeave={onDragLeave} className={classes.dragOverlay}>
            <Typography className={classes.dragOverlayChildren} variant="button">
              Drop it
            </Typography>
            <Typography className={classes.dragOverlayChildren}>
              Add a file by dropping it anywhere on this window.
            </Typography>
          </div>
        )}
      </>
      <Layout
        top={[
          <Header
            key="top1"
            leftAction={
              <IconButton
                onClick={() => {
                  history.push(ROUTES.LANDING_PAGE)
                }}
              >
                <ArrowLeft strokeWidth={1} />
              </IconButton>
            }
          >
            Share
          </Header>,
          <div key="top2">
            Use the button below, or drag and drop, to select a file you would like to share on the Swarm network.
          </div>,
        ]}
        center={[
          <Button key="center1" component="label" size="large" className={classes.button}>
            <Plus strokeWidth={1} />
            Add a file
            <input
              type="file"
              hidden
              onChange={event => {
                if (event.target?.files?.length === 1) setFile(event.target.files[0]) // eslint-disable-line
              }}
            />
            <Plus style={{ opacity: 0 }} />
          </Button>,
        ]}
        bottom={[<span key="bottom">Maximum file size is 10MB. You can upload only one file at a time.</span>]}
      />
    </div>
  )
}
