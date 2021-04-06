import styled, { css } from 'styled-components'

export const Row = styled.div`
	display: flex;
	${props =>
		props.between &&
		css`
			justify-content: space-between;
		`}
`

export const Col = styled.div`
	flex: ${props => props.size};
`
