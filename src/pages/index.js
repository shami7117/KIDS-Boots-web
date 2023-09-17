import Image from 'next/image'
import Hero from '@/components/home/hero/Hero'
import WhatWe from '@/components/home/whatwedo/WhatWe'

import Feature from '@/components/home/featurecollection/Feature'
import Popular from '@/components/home/popularcollection/Popular'
import { Montserrat } from 'next/font/google'
const font =Montserrat({ subsets: ['latin'] })

export default function Home() {
  return (
   <div className={font.className}>
    <Hero/>
    <WhatWe/>
    <Feature/>
    <Popular/>
   </div>
  )
}
