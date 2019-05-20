import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

class ChatWindow extends Component {

  state = {
    chatMessages: [{ name: 'Andrew', message: 'Hello' }],
    chatInput: '',
    showChat: false
  }

  messageEnd = React.createRef()

  scrollToBottom = () => {
    this.messageEnd.current.scrollIntoView({behavior: 'smooth'})
  }

  componentDidMount(){
    this.scrollToBottom()
  }

  componentDidUpdate(){
    this.scrollToBottom()
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

  toggleShow = () => {
    this.setState({
      showChat: !this.state.showChat
    })
  }

  componentWillUnmount = async () => {
    await axios.post('/api/chat', { group_id: this.props.group_id, messages: this.props.chatMessages })
  }

  render() {
    let messages
    if (this.props.chatMessages) {
      messages = this.props.chatMessages.map(message => {
        if (message.name === this.props.firstname) {
          return <div key={Math.random()} className='user-message'>
            <p className='message-text'>{message.message}</p>
          </div>
        } else {
          return <div key={Math.random()} className='other-message'>
            <img src={message.image} alt={message.name} className='message-image' />
            <span className='message-text'>{message.name}:  {message.message}</span>
          </div>
        }

      })
    }

    let className

    if(this.state.showChat){
      className = 'show-chat'
    } else {
      className = 'hide-chat'
    }

    return (
      <div className={`Chat-Window ${className}`}>
        <div className="chat-title">
          CHAT
          {this.state.showChat ? 
          <FontAwesomeIcon 
          icon='minus-square' 
          onClick={this.toggleShow}
          className='chat-icon'/> :
          
          <FontAwesomeIcon 
          icon='plus-square'
          onClick={this.toggleShow}
          className='chat-icon'/>}
        </div>
        <div className="chat-hold">
          <div className="messages-hold">
            {messages}
            <div className="message-end" ref={this.messageEnd}></div>
          </div>


          <div className="chat-input-hold">
            <form
              onSubmit={(e) => this.handleChatSend(e)}
              className="chat-form">
              <img src={this.props.image} alt={this.props.firstname} className='chat-image' />
              <input type="text"
                name='chatInput'
                onChange={(e) => this.handleChatInput(e)}
                value={this.state.chatInput}
                autoComplete='off'
                className='chat-input' />
              <button>Send</button>
            </form>
          </div>
        </div>


      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  return {
    group_id: reduxState.group.group_id
  }
}

export default connect(mapStateToProps)(ChatWindow)