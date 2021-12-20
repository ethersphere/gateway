import { ReactElement, useEffect, useState, useContext } from 'react'
import { readAndCompressImage } from 'browser-image-resizer'

import SharePage from './Share'
import AddFile from './AddFile'
import Upload from './Upload'

import { Context } from '../../providers/bee'
import { getMetadata } from '../../utils/file'

export default function ShareGeneral(): ReactElement {
  const [files, setFiles] = useState<SwarmFile[]>([])
  const [uploadReference, setUploadReference] = useState('')
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<boolean>(false)
  const [preview, setPreview] = useState<string | undefined>(undefined)
  const [previewBlob, setPreviewBlob] = useState<Blob | undefined>(undefined)
  const [metadata, setMetadata] = useState<Metadata | undefined>()
  const { upload } = useContext(Context)

  useEffect(() => {
    setMetadata(getMetadata(files))

    if (preview) {
      URL.revokeObjectURL(preview) // Clear the preview from memory
      setPreview(undefined)
      setPreviewBlob(undefined)
    }

    if (files.length !== 1 || !files[0].type.startsWith('image')) return

    readAndCompressImage(files[0], { maxWidth: 896, maxHeight: 672, autoRotate: false }).then(blob => {
      setPreview(URL.createObjectURL(blob)) // NOTE: Until it is cleared with URL.revokeObjectURL, the file stays allocated in memory
      setPreviewBlob(blob)
    })

    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [files]) //eslint-disable-line react-hooks/exhaustive-deps

  const uploadFile = () => {
    if (files.length === 0 || !metadata) return

    setIsUploadingFile(true)
    setUploadError(false)

    upload(files, metadata, previewBlob)
      .then(hash => {
        setUploadReference(hash)
      })
      .catch(() => setUploadError(true)) // eslint-disable-line
      .finally(() => {
        setIsUploadingFile(false)
      })
  }

  if (files.length === 0) return <AddFile setFiles={setFiles} />

  if (uploadReference) return <SharePage uploadReference={uploadReference} metadata={metadata} />

  return (
    <Upload
      uploadError={uploadError}
      setFiles={setFiles}
      metadata={metadata}
      preview={preview}
      files={files}
      uploadFile={uploadFile}
      isUploadingFile={isUploadingFile}
    />
  )
}
