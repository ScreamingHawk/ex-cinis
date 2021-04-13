import React from 'react'
import styled from 'styled-components'

const StyledAlert = styled.div`
	position: fixed;
	top: 1em;
`

const SpacedButton = styled.button`
	margin-left: 1em;
`

export function Alert({ message, dismiss, level }) {
	level = level || 'danger'
	return (
		<StyledAlert className={`alert alert-${level}`} role="alert">
			{message}
			<SpacedButton
				type="button"
				className="close"
				data-dismiss="alert"
				aria-label="Close"
				onClick={dismiss}
			>
				<span aria-hidden="true">&times;</span>
			</SpacedButton>
		</StyledAlert>
	)
}
