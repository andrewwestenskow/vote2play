import React, {Component} from 'react'
import axios from 'axios'
import {connect} from 'react-redux'

class ChatWindow extends Component {

  state={
    chatMessages: ['hello'],
    chatInput: ''
  }

  handleChatInput = (e) => {
    this.setState({
      chatInput: e.target.value
    })
  }

  render(){
    let messages
    if(this.state.chatMessages.length !==0){
      messages = 'hello'
    }

    return(
      <div className='Chat-Window'>
        {messages}
        <input type="text" name='chatInput' 
        onChange={(e) => this.handleChatInput(e)} 
        value={this.state.chatInput}/>
      </div>
    )
  }
}

export default ChatWindow