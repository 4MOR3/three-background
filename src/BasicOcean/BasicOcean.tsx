import React, { PropsWithChildren, useEffect, useRef } from "react"
import OF from "./Script"
interface PropType { 
  
}
const BasicOcean: React.FC<PropsWithChildren<PropType>> = (prop) =>{ 
  
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => { 
    const main = new OF(container.current)
    main.animate();
    return () => { 
      main.destructor();
    }
  }, [])
  return <div ref={container}>{prop.children}</div>

}
export default BasicOcean