import React, {Component} from 'react'

class EditForm extends Component{

  state = {
    firstname: this.props.userInfo.firstname,
    lastname: this.props.userInfo.lastname,
    image: this.props.userInfo.image,
    favoritesong: this.props.userInfo.favoritesong,
  }

  handleEditFormInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleEditFormSubmit = (e) => {
    e.preventDefault()
    const {firstname, lastname, favoritesong, image} = this.state
    const body = {
      firstname,
      lastname,
      favoritesong,
      image
    }

    this.props.sendForm(body)
  }

  render(){

    return(
      <div>
        <form>
              <input type="text" 
              name='firstname' 
              value={this.state.firstname} 
              onChange={this.handleEditFormInput}/>

              <input type="text" 
              name='lastname' 
              value={this.state.lastname} 
              onChange={this.handleEditFormInput} />

              <input type="text" 
              name='favoritesong' 
              value={this.state.favoritesong} 
              onChange={this.handleEditFormInput}/>

              <input type="text" 
              name='image' 
              value={this.state.image} 
              onChange={this.handleEditFormInput}/>

              <button onClick={this.props.toggleEdit}>Cancel</button>
              <button onClick={this.handleEditFormSubmit}>Save</button>
            </form>
      </div>
    )
  }
}

export default EditForm