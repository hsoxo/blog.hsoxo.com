import 'd3-transition'
import { select } from 'd3-selection'
import React from 'react'
import ReactWordcloud from 'react-wordcloud'
import { navigate } from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import tagColor, { getRandomColor } from '../components/tag-colors'


function getCallback(callback) {
  return function(word, event) {
    const isActive = callback !== 'onWordMouseOut'
    const element = event.target
    const text = select(element)
    text
      .on('click', () => {
        if (isActive) {
          navigate(`/tag/${word.text.toLowerCase()}`)
        }
      })
      .transition()
      .attr('background', 'white')
  }
}

const callbacks = {
  getWordColor: word => tagColor[word.text.toLowerCase()] || getRandomColor(),
  getWordTooltip: word =>
    `Tag "${word.text}" appears ${word.value} times.`,
  onWordClick: getCallback('onWordClick'),
  onWordMouseOut: getCallback('onWordMouseOut'),
  onWordMouseOver: getCallback('onWordMouseOver'),
}

function BlogTags({pageContext}) {
  return (
    <Layout title={"Achieves"}>
      <SEO title={"Achieves"}/>
        <div style={{ height: '75vh', width: '100%' }}>
          <ReactWordcloud
            callbacks={callbacks}
            words={pageContext.tags}
            options={{
              rotationAngles: [0, 0],
              rotations: 0,
              fontFamily: 'Impact',
              fontSizes: [25, 120]
            }}
          />
        </div>
    </Layout>
  )
}

export default BlogTags
