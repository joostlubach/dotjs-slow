import * as React from 'react'
import {jss, colors} from '@ui/styles'

export interface Props {
  classNames?: React.ClassNamesProp
}

export default class Credits extends React.Component<Props> {

  public render() {
    return (
      <div classNames={[$.credits, this.props.classNames]}>
        {this.renderContent()}
      </div>
    )
  }

  private renderContent() {
    return (      
      <div classNames={$.content}>
        <p>
          <em>Slow Burgers</em> is an adapted version of a learning environment created by <a href="https://github.com/joostlubach" target="_blank">Joost Lubach</a>. It is meant as a
          learning tool for asynchronous programming. Also check out <a href="http://roverjs.com" target="_blank">RoverJS</a>, the spritual ancestor of <em>Slow Burgers</em>. The source code for Slow Burgers can be found <a href="https://github.com/joostlubach/dotjs-slow" target="_blank">here</a>.
        </p>
        <p>
          <em>Slow Burgers</em> was showcased at dotJS 2018 in Paris. 
        </p>

        <p>
          Usage:
        </p>
        <p>
          Use the selector in the top left corner to illustrate various scenarios. Then either step through the code, or
          play the scenario automatically using the play button.
        </p>
        <p>
          It is possible to modify the code in the editors (although the cartoon actions are pre-programmed). To revert
          to the original scenario code, use the reset button next to the scenario selector.
        </p>
        <p>
          Keyboard shortcuts:
        </p>
        <ul>
          <li>
            <strong>Space or PgDown</strong>: Go forward, or advance to the next scenario (presentation mode). 
          </li>
          <li>
            <strong>P or PgUp</strong>: Go backward, or go to the previous scenario (presentation mode). 
          </li>
          <li>
            <strong>← / →</strong>: Go back / forward
          </li>
          <li>
            <strong>↓</strong>: Play / pause
          </li>
          <li>
            <strong>↑</strong>: Reset to the beginning of the scenario
          </li>
          <li>
            <strong>1</strong>: Zoom in/out on Étienne
          </li>
          <li>
            <strong>2</strong>: Zoom in/out on Marie
          </li>
          <li>
            <strong>3</strong>: Zoom in/out on Chef
          </li>
          <li>
            <strong>0</strong>: Zoom out
          </li>
        </ul>
        <p>
          Disclaimer:
        </p>
        <p>
          Slow Burgers was designed for a specific use in the classroom. Due to popular demand, I put it up here, but
          I take no responsibility for its operating correctly in various browsers / environments. I use Chrome on my Mac,
          which works nicely.
        </p>
        <p>
         Ironically, even though I claim to have built the first responsive hamburger restaurant in the world, this application does not work on a mobile device. Well, it works, but it looks like crap. Also, the background images that I use are ridiculously large and not compressed.
        </p>
        <p>
          About me:
        </p>
        <p>
          I am a freelance developer based in Amsterdam. Besides freelancing, I teach as a volunteer for <a href="https://www.hackyourfuture.net" target="_blank">Hack Your Future</a>, a programming school for refugees.
          I also work on a product of my own, called <a href="https://groundcontrol.app" target="_blank">GroundControl</a>, a participant guide app &amp; management system for corporate events and festivals.
        </p>
        <p>
          Don't hesitate to reach out (<a href="mailto:joostlubach@gmail.com">joostlubach@gmail.com</a>) for questions
          or to ask me to show Slow Burgers at your conference :-). Also, I have twitter (<a href="https://twitter.com/joostlubach" target="_blank">@joostlubach</a>), but it's mostly in Dutch and I hardly ever tweet professionally. Finally, if you're not a recruiter but you have a cool project you need a developer for, check out my LinkedIn (<a href="https://linkedin.com/in/yoazt" target="_blank">@yoazt</a>).
        </p>
      </div>
    )
  }

}

const $ = jss({
  credits: {
    overflow: 'auto'
  },

  content: {
    lineHeight: '31.5px',
    color:      colors.black,
    padding:    [32, 64, 32, 0],

    '& strong': {
      fontWeight: 'normal',
      color:      colors.red
    },

    '& a': {
      color: colors.red,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline'
      }
    },

    '& ul': {
      margin: 0,
      padding: 0,
    },

    '& li': {
      listStyle: 'none'
    },

    '& > :not(:last-child)': {
      marginBottom: 31.5
    }
  }
})