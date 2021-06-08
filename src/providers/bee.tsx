import { createContext, ReactChild, ReactElement, useEffect, useState } from 'react'
import { Bee, Reference } from '@ethersphere/bee-js'
import { apiHost, META_FILE_NAME, postageStamp } from '../constants'

const bee = new Bee(apiHost)

interface ContextInterface {
  stamp: Reference | undefined // FIXME: should not be exposed in final version
  purchaseStamp: () => Promise<void> // FIXME: should not be exposed in final version
  isConnected: boolean
  upload: (file: File) => Promise<Reference>
  getMetadata: (hash: Reference) => Promise<Metadata | undefined>
}

const initialValues: ContextInterface = {
  stamp: undefined,
  isConnected: false,
  purchaseStamp: () => Promise.reject(),
  upload: () => Promise.reject(),
  getMetadata: () => Promise.reject(),
}

export const Context = createContext<ContextInterface>(initialValues)
export const Consumer = Context.Consumer

interface Props {
  children: ReactChild
}

export function Provider({ children }: Props): ReactElement {
  const [stamp, setStamp] = useState<Reference | undefined>(postageStamp)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const upload = (file: File) => {
    if (!stamp) return Promise.reject()

    const metadata = {
      path: (file as any)?.path,
      name: file.name,
      type: file.type,
      size: file.size,
    }

    const metafile = new File([JSON.stringify(metadata)], META_FILE_NAME, {
      type: 'application/json',
    })

    return bee.uploadFiles(stamp, [file, metafile], { indexDocument: metadata.path })
  }

  const getMetadata = async (hash: Reference): Promise<Metadata | undefined> => {
    try {
      const metadata = await bee.downloadFile(hash, META_FILE_NAME)

      return JSON.parse(metadata.data.text()) as Metadata
    } catch (e) {
      console.error(e) //eslint-disable-line
    }
  }

  const purchaseStamp = async (amount = BigInt(1000), depth = 16) => {
    const ps = await bee.createPostageBatch(amount, depth)
    setStamp(ps)
  }

  useEffect(() => {
    bee.isConnected().then(setIsConnected)
  }, [])

  return (
    <Context.Provider value={{ getMetadata, isConnected, stamp, upload, purchaseStamp }}>{children}</Context.Provider>
  )
}
