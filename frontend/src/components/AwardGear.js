import React from 'react'

export function AwardGear({ awardGear }) {
	return (
		<div>
			<h4>Award Gear</h4>
			<form
				onSubmit={event => {
					event.preventDefault()
					awardGear()
				}}
			>
				<div className="form-group">
					<input className="btn btn-primary" type="submit" value="Award Gear" />
				</div>
			</form>
		</div>
	)
}
