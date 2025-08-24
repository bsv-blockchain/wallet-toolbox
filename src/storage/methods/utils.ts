import { WERR_INVALID_PARAMETER } from '../../sdk/WERR_errors'

/**
 * Returns the byte size required to encode number as Bitcoin VarUint
 * @publicbody
 */
export function varUintSize(val: number): 1 | 3 | 5 | 9 {
  if (val < 0) throw new WERR_INVALID_PARAMETER('varUint', 'non-negative')
  return val <= 0xfc ? 1 : val <= 0xffff ? 3 : val <= 0xffffffff ? 5 : 9
}

/**
 * @param scriptSize byte length of input script
 * @returns serialized byte length a transaction input
 */
export function transactionInputSize(scriptSize: number): number {
  return (
    32 + // txid
    4 + // vout
    varUintSize(scriptSize) + // script length, this is already in bytes
    scriptSize + // script
    4
  ) // sequence number
}

/**
 * @param scriptSize byte length of output script
 * @returns serialized byte length a transaction output
 */

export function transactionOutputSize(scriptSize: number): number {
  return (
    varUintSize(scriptSize) + // output script length, from script encoded as hex string
    scriptSize + // output script
    8
  ) // output amount (satoshis)
}

/**
 * Compute the serialized binary transaction size in bytes
 * given the number of inputs and outputs,
 * and the size of each script.
 * @param inputs array of input script lengths, in bytes
 * @param outputs array of output script lengths, in bytes
 * @returns total transaction size in bytes
 */
export function transactionSize(inputs: number[], outputs: number[]): number {
  return (
    4 + // Version
    varUintSize(inputs.length) + // Number of inputs
    inputs.reduce((a, e) => a + transactionInputSize(e), 0) + // all inputs
    varUintSize(outputs.length) + // Number of outputs
    outputs.reduce((a, e) => a + transactionOutputSize(e), 0) + // all outputs
    4
  ) // lock time
}
