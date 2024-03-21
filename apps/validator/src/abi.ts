export const abi = [
  { inputs: [{ internalType: 'address', name: 'user', type: 'address' }], name: 'AlreadyQueuedError', type: 'error' },
  { inputs: [{ internalType: 'address', name: 'user', type: 'address' }], name: 'NotQueuedError', type: 'error' },
  {
    inputs: [
      { internalType: 'uint256', name: 'blockTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'expiresAt', type: 'uint256' }
    ],
    name: 'TimestampExpiredError',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'blockTimestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'TimestampNotInRangeError',
    type: 'error'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'blockTimestmap', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'TimestampNotPassedError',
    type: 'error'
  },
  { inputs: [], name: 'TxFailedError', type: 'error' },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'EmergencyWithdraw',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'target', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'Execute',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [{ indexed: false, internalType: 'uint8', name: 'version', type: 'uint8' }],
    name: 'Initialized',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'target', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'value', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    name: 'Queue',
    type: 'event'
  },
  {
    inputs: [],
    name: 'MAX_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'MIN_DELAY',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_amount', type: 'uint256' }],
    name: 'emergencyWithdraw',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'execute',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_user', type: 'address' }],
    name: 'getQueue',
    outputs: [
      { internalType: 'bool', name: '_queued', type: 'bool' },
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'uint256', name: '_timestamp', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'initialize', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '_timestamp', type: 'uint256' }],
    name: 'queue',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'userStaking',
    outputs: [
      { internalType: 'bool', name: 'queued', type: 'bool' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { stateMutability: 'payable', type: 'receive' }
] as const
