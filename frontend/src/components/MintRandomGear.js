import React from 'react'

export function MintRandomGear({ mintRandomGear }) {
	return (
		<div>
			<h4>Award Gear</h4>
			<form
				onSubmit={event => {
					event.preventDefault()
					mintRandomGear()
				}}
			>
				<div className="form-group">
					<input className="btn btn-primary" type="submit" value="Award Gear" />
				</div>
			</form>
		</div>
	)
}
