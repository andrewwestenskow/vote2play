import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'
import { v4 as randomString } from 'uuid'
import axios from 'axios'

class EditForm extends Component {

  state = {
    firstname: this.props.userInfo.firstname,
    lastname: this.props.userInfo.lastname,
    image: this.props.userInfo.image,
    favoritesong: this.props.userInfo.favoritesong,
    isUploading: false,
    showImageInput: true,
    showUploadImage: false,
    loading: false
  }

  handleEditFormInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleEditFormSubmit = (e) => {
    e.preventDefault()
    const { firstname, lastname, favoritesong, image } = this.state
    const body = {
      firstname,
      lastname,
      favoritesong,
      image
    }

    this.props.sendForm(body)
  }

  //IMAGE UPLOAD MORE DETAILED COMMENTS IN CREATE GROUP COMPONENT

  getSignedRequest = ([file]) => {
    this.setState({ isUploading: true })

    const fileName = `${randomString()}-${file.name.replace(/\s/g, '-')}`

    axios.get('/sign-s3', {
      params: {
        'file-name': fileName,
        'file-type': file.type
      }
    }).then((response) => {
      const { signedRequest, url } = response.data
      this.uploadFile(file, signedRequest, url)
    }).catch(err => {
      console.log(err)
    })
  }

  uploadFile = (file, signedRequest, url) => {
    const options = {
      headers: {
        'Content-Type': file.type,
      },
    };

    axios
      .put(signedRequest, file, options)
      .then(response => {
        this.setState({
          isUploading: false,
          image: url,
          showImageInput: false,
          showUploadImage: true
        });
      })
      .catch(err => {
        this.setState({
          isUploading: false,
        });
        if (err.response.status === 403) {
          alert(
            `Your request for a signed URL failed with a status 403. Double check the CORS configuration and bucket policy in the README. You also will want to double check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your .env and ensure that they are the same as the ones that you created in the IAM dashboard. You may need to generate new keys\n${
            err.stack
            }`
          );
        } else {
          alert(`ERROR: ${err.status}\n ${err.stack}`);
        }
      });
  };


  toggleLoad = () => {
    this.setState({
      loading: true
    })
    setTimeout(() => {
      this.setState({
        loading: false
      })
    }, 500);
  }

  render() {

    return (
      <div className='edit-form-hold'>
        <form className='edit-form'>
          <div>
            <h1 className="edit-form-head">First Name</h1>
            <input type="text"
              name='firstname'
              value={this.state.firstname}
              onChange={this.handleEditFormInput}
              className='edit-form-input' />

            <h1 className="edit-form-head">Last Name</h1>
            <input type="text"
              name='lastname'
              value={this.state.lastname}
              onChange={this.handleEditFormInput}
              className='edit-form-input' />

            <h1 className="edit-form-head">Favorite Song</h1>
            <input type="text"
              name='favoritesong'
              value={this.state.favoritesong}
              onChange={this.handleEditFormInput}
              className='edit-form-input' />
          </div>

          <div className='profile-edit-hold'>
            <h1 className="edit-form-head">Profile Image</h1>
            <input type="text"
              name='image'
              value={this.state.image}
              onChange={this.handleEditFormInput}
              className='edit-form-input' />

            <p style={{color: 'white', marginBottom: '15px'}}>--or--</p>

            {!this.state.showUploadImage ? <Dropzone
              onDropAccepted={this.getSignedRequest}
              accept='image/*'
              multiple={false}
              className='Dropzone'>

              {({ getRootProps, getInputProps }) => (

                <section className="container">
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <div>
                      {this.state.isUploading
                        ? <GridLoader />
                        : <p>Drop File or Click Here</p>
                      }
                    </div>
                  </div>
                </section>

              )}

            </Dropzone> :
              <div>
                {!this.state.loading ?
                  <img
                    src={this.state.image}
                    alt='Profile'
                    onError={this.toggleLoad} /> :
                  <GridLoader />}
              </div>}</div>

          <button className='edit-form-button' onClick={this.props.toggleEdit}>Cancel</button>
          <button className='edit-form-button' onClick={this.handleEditFormSubmit}>Save</button>
        </form>
      </div>
    )
  }
}

export default EditForm