import React from "react"
import { useEffect, useRef } from "react"
import BOFactory from "./BasicOceanFactory"

function BasicOcean() { 
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => { 
    const main = new BOFactory(container.current)
    main.animate()
    return () => { 
      main.destructor();
    }
  }, [])
  const dom = (<div ref={container}>
  </div>)
  return dom;
}
export default BasicOcean