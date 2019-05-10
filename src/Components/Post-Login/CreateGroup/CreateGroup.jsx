import React, { Component } from 'react'
import axios from 'axios'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import Dropzone from 'react-dropzone'
import { GridLoader } from 'react-spinners'
import {v4 as randomString} from 'uuid'

class CreateGroup extends Component {

  state = {
    groupName: '',
    groupImage: '',
    isUploading: false
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
        this.setState({ isUploading: false, url });
        // THEN DO SOMETHING WITH THE URL. SEND TO DB USING POST REQUEST OR SOMETHING
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

  handleCreateGroup = async (e) => {
    e.preventDefault()
    const { groupName, groupImage } = this.state
    const { login_id } = this.props

    let body = {
      name: groupName,
      require_admin_join: false,
      require_admin_song: false,
      login_id,
      group_image: groupImage
    }

    try {
      await axios.post('/api/group/create', body)
      this.props.history.push(`/${login_id}/dashboard`)

    } catch (error) {
      alert(`Error, please try again`)
    }
  }

  handleCreateGroupFormUpdate = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

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
      this.setState({
        groupImage: url
      })
    }).catch(err => {
      console.log(err)
    })
  }

  render() {
    return (
      <div className='Create-Group'>Create GROUP

        <form onSubmit={this.handleCreateGroup}>
          <p>Group Name</p>
          <input type="text" name='groupName' onChange={this.handleCreateGroupFormUpdate} />
          <p>Group Image</p>
          <input type="text" name='groupImage' onChange={this.handleCreateGroupFormUpdate} value={this.state.groupImage} />

          <Dropzone
            onDropAccepted={this.getSignedRequest}
            accept='image/*'
            multiple={false} >

            {({ getRootProps, getInputProps }) => (

              <section className="container">
                <div {...getRootProps({ className: 'dropzone' })}>
                  <input {...getInputProps()} />
                  <div style={{
                    position: 'relative',
                    width: 200,
                    height: 200,
                    borderWidth: 7,
                    marginTop: 100,
                    borderColor: 'rgb(102, 102, 102)',
                    borderStyle: 'dashed',
                    borderRadius: 5,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 28,
                  }} className='File-Drop'>
                    {this.state.isUploading
                      ? <GridLoader />
                      : <p>Drop File or Click Here</p>
                    }
                  </div>
                </div>
              </section>

            )}

          </Dropzone>

          <button>Create Group</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (reduxState) => {
  const { login_id } = reduxState.users
  return {
    login_id
  }
}

export default connect(mapStateToProps)(withRouter(CreateGroup))