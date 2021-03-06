import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import GardenDetail from './GardenDetail'
import GardenEdit from './GardenEdit'
import NewUserForm from './NewUserForm'
import Weather from './Weather'
import GoTrashcan from 'react-icons/lib/go/trashcan'
import { PageBottom } from './Styles'

class UsersList extends Component {
    state = {
        garden: {
            users: []
        },
        user: {
            firstName: '',
            email: ''
        },
        editFormShowing: false,
        addFormShowing: false
    }

    componentWillMount = () => {
        this.getAllUsers()
    }

    // ==============================
    //     FORM EVENT HANDLERS
    // ==============================

    handleGardenChange = (event) => {
        event.preventDefault()
        const garden = { ...this.state.garden }
        garden[event.target.name] = event.target.value
        console.log("Updated Garden:", garden)
        this.setState({ garden })
    }

    handleUserChange = (event) => {
        event.preventDefault()
        const user = { ...this.state.user }
        user[event.target.name] = event.target.value
        this.setState({ user })
    }

    // ==============================
    //   CRUD for Users and Gardens
    // ==============================

    getAllUsers = async () => {
        try {
            console.log('getting users')
            const gardenId = this.props.match.params.gardenId
            const response = await axios.get(`/api/gardens/${gardenId}/users`)
            this.setState({ garden: response.data })
        }
        catch (err) {
            console.log(`Catch errror ----- ${err}`)
        }
    }

    updateGarden = async (event) => {
        event.preventDefault()
        try {

            console.log("this is updating to this garden:", this.state.garden.name)
            const response = await axios.patch(`/api/gardens/${this.state.garden._id}`, this.state.garden)
            console.log(`STATE________${this.state.editFormShowing}`)
            this.setState({
                garden: response.data,
                editFormShowing: false
            })
        } catch (err) {
            console.log(err)
        }
    }

    createNewUser = async (event) => {
        event.preventDefault()
        const payload = {
            firstName: this.state.user.firstName,
            email: this.state.user.email
        }
        const blankForm = {
            firstName: '',
            email: ''
        }
        await axios.post(`/api/gardens/${this.state.garden._id}/users`, payload)
        await this.getAllUsers()
        this.setState({
            addFormShowing: false,
            user: blankForm
        })
    }

    deleteUser = async (user) => {
        try {
            axios.delete(`/api/gardens/${this.state.garden._id}/users/${user._id}`)
            window.location.reload()

            // const indexToDelete = this.state.garden.users.indexOf(user)
            // const newUsers = [...this.state.garden.users]
            // newUsers.splice(indexToDelete, 1)
            // this.setState({ 
            //     users: newUsers 
            // })
        }
        catch (err) {
            console.log(err)
        }
    }

    // ==============================
    //        FORM TOGGLERS
    // ==============================

    toggleEditForm = () => {
        const editFormShowing = !this.state.editFormShowing
        this.setState({
            addFormShowing: false,
            editFormShowing
        })
    }

    toggleAddUserForm = () => {
        const addFormShowing = !this.state.addFormShowing
        this.setState({
            editFormShowing: false,
            addFormShowing
        })
    }

    render() {


        const garden = this.state.garden
        const userCount = this.state.garden.users.length
        console.log("USERCOUNT", userCount)

        return (
            <GardenShowUserList>
                <GardenDetailContainer>
                    {/* <GardenDetailColumn> */}
                    <GardenDetail
                        garden={this.state.garden}
                        userCount={userCount}
                    />

                    <div>
                        <GardenImage src={this.state.garden.photo_url} alt="" />
                    </div>
                </GardenDetailContainer>
                <ButtonHolder>
                    <Button onClick={this.toggleEditForm}>
                        Edit Garden Info
                    </Button>
                    <div>
                        {
                            <Link to={`/gardens`}>
                                <Button>
                                    Back To All Gardens
                        </Button>
                            </Link >
                        }
                    </div>
                </ButtonHolder>

                <div>
                    {
                        this.state.editFormShowing ?
                            <div>
                                <GardenEdit
                                    updateGarden={this.updateGarden}
                                    garden={this.state.garden}
                                    handleGardenChange={this.handleGardenChange}
                                    editFormShowing={this.editFormShowing} />
                            </div>
                            : null
                    }
                </div>


                <AboveWeather>Current Weather in {this.state.garden.city}</AboveWeather>
                <Weather />
                {/* </GardenDetailColumn> */}




                <Button onClick={this.toggleAddUserForm}>
                    Add New Gardener
                </Button>

                <div>
                    {
                        this.state.addFormShowing ?
                            <div>
                                <NewUserForm
                                    createNewUser={this.createNewUser}
                                    user={this.state.user}
                                    handleUserChange={this.handleUserChange}
                                    addFormShowing={this.addFormShowing}
                                />
                            </div>
                            : null
                    }
                </div>

                <UserListContainer>
                    {
                        garden.users.map((user, index) => {
                            return (<div className='userContainer' key={index}>

                                <Link to={`/gardens/${garden._id}/users/${user._id}/plants`}>
                                    <UserContainer>
                                        <UserNameColor>{user.firstName}</UserNameColor>

                                    </UserContainer>
                                </Link>
                                <PlantTypeCount>Types of Plants: {user.plants.length}</PlantTypeCount>
                                <TrashIcon type="submit" onClick={() => this.deleteUser(user)}><GoTrashcan /> </TrashIcon>

                            </div>)
                        })
                    }
                    {/* <div classname='userContainer'><UserContainer>plus button</UserContainer></div> */}
                </UserListContainer>
                <PageBottom></PageBottom>


            </GardenShowUserList >
        )
    }
}

export default UsersList

// ======== STYLED COMPONENTS ==========

const ButtonHolder = styled.div`
    display: flex;
`

const UserListContainer = styled.div`
    background-color: #bfd964;
    border-radius: 5px;
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    max-width: 580px;
    @media (max-width: 700px) {

  }
    `

const Button = styled.button`
    border-radius: 5px;
    background-color: #6B983F;
    color: #bfd964;
    border-radius: 5px;
    padding: 5px;
    margin: 8px;
    `

const UserContainer = styled.div`
    border: 8px #571B0D solid; 
    width: 150px; 
    height: 150px;
    margin: 20px 20px 8px 10px;
    padding: 20px 10px 10px 10px;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    &:hover {
        border: 8px #6B983F solid;
        color: #571B0D;
    }
    @media (max-width: 700px) {
    width: 100px;
    height: 100px;
    padding: 5px;
    margin: 25px 10px 0px 10px;
  }
    `
const AboveWeather = styled.div`
    padding: 30px 0 0 0px;
    color: #571B0D;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
`
const newFormStyle = {
    // border: '5px solid green',
    // backgroundColor: '#BEEE62',
    width: 300,
    fontSize: 14,
    color: '#6b983f',
    padding: '20px',
}

const UserNameColor = styled.div`
    color: #6B983F;
    text-transform: uppercase;
    font-size: 20px;
    @media (max-width: 700px) {
        width: 100px;
        height: 100px;
        padding: 5px;
        margin: 25px 10px 0px 10px;
        font-size: 12px;
        }
`
const PlantTypeCount = styled.div`
    color: #571B0D;
    text-align: center;

`

const TrashIcon = styled.div`
    font-size: 16px;
    color: #6b983f;
    width: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
    &:hover {
        color: #571B0D;
}
`
const GardenShowUserList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const GardenDetailContainer = styled.div`
    display: flex;
    padding: 20px;
    flex-direction: row;
    @media (max-width: 700px) {

    flex-direction: column;
}
`

const GardenImage = styled.img`
    width: 400px;
    border-radius: 5px;
    border: 5px solid #571B0D;
    margin: 10px;
    @media (max-width: 700px) {

    width: 350px;
}
`

const GardenDetailColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
