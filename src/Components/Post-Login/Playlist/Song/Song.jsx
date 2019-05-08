import React, {Component} from 'react'

class Song extends Component {

  render(){
    const {songId, songUrl, score} = this.props

    return(
      <div>
        {songId}
        {songUrl}
        {score}
      </div>
    )
  }
}

export default Song