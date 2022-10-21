import { NextPage } from 'next'
import dynamic from 'next/dynamic'
//import Header from '@components/Header'

const Canvas = dynamic(() => import('./mintCanvas'), {
  ssr: false,
})

const MintPage: NextPage = () => {
  return (
    <>
      <main>
        <Canvas />
      </main>
    </>
  )
}

export default MintPage
