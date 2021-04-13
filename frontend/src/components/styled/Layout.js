import styled, { css } from 'styled-components'

export const Row = styled.div`
	display: flex;
	align-items: center;
	${props =>
		props.vertical &&
		css`
			flex-direction: column;
		`}
	${props =>
		props.around &&
		css`
			justify-content: space-around;
		`}
	${props =>
		props.between &&
		css`
			justify-content: space-between;
		`}
	${props =>
		props.center &&
		css`
			justify-content: center;
		`}
`

export const Col = styled.div`
	flex: ${props => props.size};
`
