import React from 'react'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'

import { Row } from './styled/Layout'
import { Button } from './styled/Button'

const InlineIcon = styled(ReactSVG)`
	svg {
		height 1.5em;
	}
`

export const MetaMaskButton = ({ onClick, text }) => (
	<Button type="button" onClick={onClick}>
		<Row center>
			<InlineIcon src="/MetaMask_Fox.svg" />
			<span>{text}</span>
		</Row>
	</Button>
)
