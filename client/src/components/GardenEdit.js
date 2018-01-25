import React from 'react'
import styled from 'styled-components'
import SubmitButton from './SubmitButton'

function GardenEdit(props) {

    return (
        <div>
            <h3>Gardens</h3>
            <form onSubmit={props.updateGarden(props.garden)}>
                <div>
                    <label htmlFor="name">Garden Name</label>
                    <input onChange={props.handleChange} name="name" type="text" value={props.garden.name} />
                </div>
                <div>
                    <label htmlFor="address">Address</label>
                    <input onChange={props.handleChange} name="address" type="text" value={props.garden.address} />
                </div>
                <div>
                    <label htmlFor="city">City</label>
                    <input onChange={props.handleChange} name="city" type="text" value={props.garden.city} />
                </div>
                <div>
                    <label htmlFor="state">State</label>
                    <input onChange={props.handleChange} name="state" type="text" value={props.garden.state} />
                </div>
                <div>
                    <SubmitButton />
                </div>

            </form>
        </div>
    )

}

export default GardenEdit