import React from 'react'

declare module '*.svg' {
  const svg: {attributes: React.SVGAttributes<SVGElement>, content: string}
  export default svg
}