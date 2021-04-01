/**
 * Utility method that turns an RPC error into a human readable message.
 */
export const getRpcMessage = response =>
	(response.data ? response.data.message : response.message)
		.split('revert')
		.pop()
		.trim()
