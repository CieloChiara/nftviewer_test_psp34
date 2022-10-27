import { NextPage } from 'next'
import dynamic from 'next/dynamic'
//import Header from '@components/Header'

const Canvas = dynamic(() => import('../components/IndexCanvas'), {
  ssr: false,
  loading: () => <p>Now Loading...</p>,
})

const IndexPage: NextPage = () => {
  return (
    <main>
      <Canvas />
    </main>
  )
};

export default IndexPage;