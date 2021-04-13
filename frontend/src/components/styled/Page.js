import styled, { css } from 'styled-components'

export const Page = styled.div`
	min-height: 100vh;
	min-width: 100vw;

	background-color: black;
	color: white;

	font-family: mono;

	${props =>
		props.center &&
		css`
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		`}
`
