import React from "react"

const Footer = () => (
  <footer style={{textAlign: 'center', margin: 30}}>
    © {new Date().getFullYear()}, Built with
    {` `}
    <a href="https://www.gatsbyjs.org" rel="noopener noreferrer">Gatsby</a>{` ・ `}
    <a href="http://www.beian.miit.gov.cn/" rel="noopener noreferrer">黑ICP备20001031号</a>
  </footer>
)

export default Footer
