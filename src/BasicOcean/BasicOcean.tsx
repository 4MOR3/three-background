import React, { FC, PropsWithChildren, ReactNode, useEffect, useRef } from "react"
import OF from "./Script"
interface PropType { 
  
}
function BasicOcean(prop: PropsWithChildren<PropType>) { 
  
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => { 
    const main = new OF(container.current)
    main.animate();
    return () => { 
      main.destructor();
    }
  },[])
  const dom = <div ref={container}>{ prop.children }</div>
  return dom
}
export default BasicOcean