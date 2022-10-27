import { NextPage } from 'next'
import dynamic from 'next/dynamic'
//import Header from '@components/Header'

const Canvas = dynamic(() => import('../components/MintCanvas'), {
  ssr: false,
  loading: () => <p>Now Loading...</p>,
})

const MintPage: NextPage = () => {
  return (
    <main>
      <Canvas />
    </main>
  )
};

export default MintPage;