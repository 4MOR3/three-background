import React from "react"
import { useEffect, useRef } from "react"
import BOFactory from "./BasicOceanFactory"
function BasicOcean() { 
  const container = useRef<HTMLDivElement>(null)
  useEffect(() => { 
    useEffect(() => { 
      const main = new BOFactory(container.current)
      main.animate()
      return () => { 
        main.destructor();
      }
    }, [])
  },[])
  return React.createElement("div", {
    ref: container
  })
} 
export default BasicOcean
