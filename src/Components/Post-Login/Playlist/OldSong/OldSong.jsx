import React, {Component} from 'react'

class OldSong extends Component {

  render(){
    return(
      <div>
      {this.props.title}
      <button>Add Again</button>
      <button>Delete</button>
      </div>
    )
  }
}

export default OldSong