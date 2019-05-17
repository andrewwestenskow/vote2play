import React, { Component } from 'react'
import axios from 'axios'

class ChatWindow extends Component {

  state = {
    chatMessages: [{ name: 'Andrew', message: 'Hello' }],
    chatInput: ''
  }

  handleChatInput = (e) => {
    this.setState({
      chatInput: e.target.value
    })
  }

  handleChatSend = (e) => {
    e.preventDefault()
    if (this.state.chatInput !== '') {
      let message = {
        name: this.props.firstname,
        message: this.state.chatInput,
        image: this.props.image
      }
      this.props.handleChatSend(message)
      this.setState({
        chatInput: ''
      })
    }
  }

  render() {
    let messages
    if (this.props.chatMessages.length !== 0) {
      messages = this.props.chatMessages.map(message => {
        return <p key={Math.random()}>{message.name}: {message.message}</p>
      })
    }

    return (
      <div className='Chat-Window'>


        <div className="messages-hold">
          {messages}
        </div>


        <div className="chat-input-hold">
          <form onSubmit={(e) => this.handleChatSend(e)}
            className="chat-form">
            <img src={this.props.image} alt={this.props.firstname} className='chat-image' />
            <input type="text"
              name='chatInput'
              onChange={(e) => this.handleChatInput(e)}
              value={this.state.chatInput}
              autoComplete='off' />
            <button>Send</button>
          </form>
        </div>


      </div>
    )
  }
}

export default ChatWindow