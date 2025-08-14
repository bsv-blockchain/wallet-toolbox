import { createLibp2p, type Libp2p } from 'libp2p'
import { tcp } from '@libp2p/tcp'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'
import { kadDHT } from '@libp2p/kad-dht'
import { gossipsub, type GossipSub } from '@chainsafe/libp2p-gossipsub'
import { preSharedKey } from '@libp2p/pnet'
import { pubsubPeerDiscovery } from '@libp2p/pubsub-peer-discovery'
import { identify } from '@libp2p/identify'
import { ping } from '@libp2p/ping'
import { multiaddr } from '@multiformats/multiaddr'
import { generateKeyPair } from '@libp2p/crypto/keys'
import type { PrivateKey } from '@libp2p/interface'

/**
 * Topic types for Teranode P2P messages
 *
 * 'bitcoin/mainnet-bestblock' is for the best block message
 * 'bitcoin/mainnet-block' is for when miners find a block solution
 * 'bitcoin/mainnet-subtree' is for when a subtree is created
 * 'bitcoin/mainnet-mining_on' is for when mining is enabled
 * 'bitcoin/mainnet-handshake' is for when a peer connects to the network
 * 'bitcoin/mainnet-rejected_tx' is for when a transaction is rejected
 */
export type Topic =
  | 'bitcoin/mainnet-bestblock'
  | 'bitcoin/mainnet-block'
  | 'bitcoin/mainnet-subtree'
  | 'bitcoin/mainnet-mining_on'
  | 'bitcoin/mainnet-handshake'
  | 'bitcoin/mainnet-rejected_tx'
  | 'bitcoin/testnet-bestblock'
  | 'bitcoin/testnet-block'
  | 'bitcoin/testnet-subtree'
  | 'bitcoin/testnet-mining_on'
  | 'bitcoin/testnet-handshake'
  | 'bitcoin/testnet-rejected_tx'

export interface SubscriberConfig {
  bootstrapPeers?: string[] // Array of bootstrap peer multiaddrs
  staticPeers?: string[] // Optional array of static peer multiaddrs
  sharedKey?: string // Hex string of the shared PSK (without headers)
  dhtProtocolID?: string // DHT protocol prefix, default '/teranode'
  topics?: Topic[] // Array of topics to subscribe to
  listenAddresses?: string[] // Listening addresses
  usePrivateDHT?: boolean // Whether to use private DHT
}

// Type definitions
type MessageCallback = (data: Uint8Array, topic: Topic, from: string) => void
type TopicCallbacks = Partial<Record<Topic, MessageCallback>>
interface TeranodeListenerConfig extends Omit<SubscriberConfig, 'topics'> {
  // Inherits all SubscriberConfig options except topics
}

/**
 * TeranodeListener provides a callback-based API for subscribing to Teranode P2P topics.
 * Each topic can have its own callback function for handling messages.
 */
export class TeranodeListener {
  private node: Libp2p | null = null
  private topicCallbacks: TopicCallbacks
  private config: TeranodeListenerConfig
  private reconnectionInterval?: NodeJS.Timeout

  /**
   * Creates a new TeranodeListener instance.
   * @param topicCallbacks - Object mapping topic names to callback functions
   * @param config - Optional configuration (uses Teranode mainnet defaults)
   */
  constructor(topicCallbacks: TopicCallbacks, config: TeranodeListenerConfig = {}) {
    this.topicCallbacks = topicCallbacks
    this.config = config

    // Start the listener automatically
    this.start().catch(console.error)
  }

  /**
   * Start the P2P listener and subscribe to topics
   */
  async start(): Promise<void> {
    if (this.node) {
      console.warn('TeranodeListener is already started')
      return
    }

    const topics = Object.keys(this.topicCallbacks) as Topic[]
    const fullConfig: SubscriberConfig = {
      ...this.config,
      topics
    }

    // Create the libp2p node using the same logic as startSubscriber
    const {
      bootstrapPeers = [
        '/dns4/teranode-bootstrap.bsvb.tech/tcp/9901/p2p/12D3KooWESmhNAN8s6NPdGNvJH3zJ4wMKDxapXKNUe2DzkAwKYqK'
      ],
      staticPeers = [
        '/dns4/teranode-mainnet-peer.taal.com/tcp/9905/p2p/12D3KooWJGPdPPw72GU6gFF4LqUjeFF7qmPCS2bZK8ywMvybYfXD',
        '/dns4/teranode-mainnet-us-01.bsvb.tech/tcp/9905/p2p/12D3KooWPJAHHaNy5BsViK1B5iTQmz5cLaUheAKEuNkHqMbwZ8jd',
        '/dns4/teranode-eks-mainnet-us-1-peer.bsvb.tech/tcp/9911/p2p/12D3KooWFjGChbwVteGsqH6NfHtKbtdW5XgnvmQRpem2kUAQjsGq',
        '/dns4/bsva-ovh-teranode-eu-1.bsvb.tech/tcp/9905/p2p/12D3KooWAdBeSVue71DTmfMEKyBG2s1hg91zJnze85rt2uKCZWbW',
        '/dns4/teranode-eks-mainnet-eu-1-peer.bsvb.tech/tcp/9911/p2p/12D3KooWRioUF2AYvC6ofiXhjE5V3MLiVrRKMAEyHiz5iYQgnB5f'
      ],
      sharedKey = '285b49e6d910726a70f205086c39cbac6d8dcc47839053a21b1f614773bbc137',
      dhtProtocolID = '/teranode',
      listenAddresses = ['/ip4/127.0.0.1/tcp/9901'],
      usePrivateDHT = true
    } = fullConfig

    // Format the PSK
    const pskText = `/key/swarm/psk/1.0.0/\n/base16/\n${sharedKey}`
    const psk = new TextEncoder().encode(pskText)
    const connectionProtector = preSharedKey({ psk })
    const privateKey: PrivateKey = await generateKeyPair('Ed25519')

    this.node = await createLibp2p({
      privateKey,
      addresses: {
        listen: listenAddresses
      },
      transports: [tcp()],
      connectionEncrypters: [noise()],
      streamMuxers: [yamux()],
      connectionProtector,
      peerDiscovery: [
        bootstrap({ list: bootstrapPeers }),
        pubsubPeerDiscovery({
          topics,
          interval: 5000
        })
      ],
      services: {
        dht: kadDHT({
          protocol: `${dhtProtocolID}/kad/1.0.0`,
          clientMode: false,
          validators: {},
          selectors: {}
        }),
        pubsub: gossipsub({
          allowPublishToZeroTopicPeers: true,
          emitSelf: false,
          fallbackToFloodsub: true,
          floodPublish: true,
          doPX: true
        }),
        identify: identify(),
        ping: ping()
      }
    })

    await this.node.start()
    console.log('TeranodeListener started with Peer ID:', this.node.peerId.toString())

    // Set up event listeners
    this.setupEventListeners()

    // Subscribe to topics with callbacks
    this.setupTopicSubscriptions()

    // Connect to static peers if provided
    if (staticPeers.length > 0) {
      await this.connectToStaticPeers(staticPeers)
      this.reconnectionInterval = this.startStaticPeerMonitoring(staticPeers)
    }

    // Handle graceful shutdown
    process.on('SIGINT', () => this.stop())
  }

  /**
   * Stop the P2P listener
   */
  async stop(): Promise<void> {
    if (!this.node) {
      return
    }

    console.log('Stopping TeranodeListener...')

    if (this.reconnectionInterval) {
      clearInterval(this.reconnectionInterval)
    }

    await this.node.stop()
    this.node = null
    console.log('TeranodeListener stopped')
  }

  /**
   * Add a new topic callback
   */
  addTopicCallback(topic: Topic, callback: MessageCallback): void {
    this.topicCallbacks[topic] = callback

    if (this.node) {
      ;(this.node.services.pubsub as any).subscribe(topic)
      console.log(`Subscribed to new topic: ${topic}`)
    }
  }

  /**
   * Remove a topic callback
   */
  removeTopicCallback(topic: Topic): void {
    delete this.topicCallbacks[topic]

    if (this.node) {
      ;(this.node.services.pubsub as any).unsubscribe(topic)
      console.log(`Unsubscribed from topic: ${topic}`)
    }
  }

  /**
   * Get the current libp2p node instance
   */
  getNode(): Libp2p | null {
    return this.node
  }

  /**
   * Get connected peer count
   */
  getConnectedPeerCount(): number {
    return this.node ? this.node.getPeers().length : 0
  }

  private setupEventListeners(): void {
    if (!this.node) return

    this.node.addEventListener('peer:discovery', (evt: any) => {
      console.log('Peer discovered:', evt.detail.id.toString())
    })

    this.node.addEventListener('peer:connect', (evt: any) => {
      console.log('✅ Peer connected:', evt.detail.toString())
      console.log('Total connected peers:', this.node!.getPeers().length)
    })

    this.node.addEventListener('peer:disconnect', (evt: any) => {
      console.log('❌ Peer disconnected:', evt.detail.toString())
      console.log('Remaining connected peers:', this.node!.getPeers().length)
    })
  }

  private setupTopicSubscriptions(): void {
    if (!this.node) return // Subscribe to topics and handle messages with callbacks
    ;(this.node.services.pubsub as any).addEventListener('gossipsub:message', (evt: any) => {
      const msg = evt.detail.msg
      const topicKey = msg.topic as Topic
      const callback = this.topicCallbacks[topicKey]

      if (callback) {
        try {
          callback(msg.data, topicKey, evt.detail.propagationSource.toString())
        } catch (error) {
          console.error(`Error in callback for topic ${topicKey}:`, error)
        }
      } else {
        console.log(`Received message on unhandled topic "${msg.topic}"`)
      }
    })

    // Subscribe to all topics
    for (const topic of Object.keys(this.topicCallbacks) as Topic[]) {
      ;(this.node.services.pubsub as any).subscribe(topic)
      console.log(`Subscribed to topic: ${topic}`)
    }
  }

  private async connectToStaticPeers(staticPeers: string[]): Promise<void> {
    if (!this.node) return

    const connectionPromises = staticPeers.map(async peerAddr => {
      try {
        console.log(`Attempting to connect to static peer: ${peerAddr}`)
        await this.node!.dial(multiaddr(peerAddr))
        console.log(`✅ Successfully connected to static peer: ${peerAddr}`)
      } catch (error) {
        console.error(`❌ Failed to connect to static peer ${peerAddr}:`, error)
      }
    })

    await Promise.allSettled(connectionPromises)
    console.log(`Static peer connection complete. Total connected peers: ${this.node.getPeers().length}`)
  }

  private startStaticPeerMonitoring(staticPeers: string[]): NodeJS.Timeout {
    return setInterval(async () => {
      if (!this.node) return

      const connectedPeerIds = this.node.getPeers().map(p => p.toString())
      const disconnectedStaticPeers: string[] = []

      for (const staticPeer of staticPeers) {
        try {
          const peerIdMatch = staticPeer.match(/\/p2p\/([^/]+)$/)
          if (peerIdMatch) {
            const peerId = peerIdMatch[1]
            if (!connectedPeerIds.includes(peerId)) {
              disconnectedStaticPeers.push(staticPeer)
            }
          }
        } catch (error) {
          console.error(`Error checking static peer ${staticPeer}:`, error)
        }
      }

      if (disconnectedStaticPeers.length > 0) {
        console.log(`Reconnecting to ${disconnectedStaticPeers.length} disconnected static peers...`)
        await this.connectToStaticPeers(disconnectedStaticPeers)
      }
    }, 30000) // 30 seconds
  }
}

export async function startSubscriber(config: SubscriberConfig = {}): Promise<void> {
  const {
    bootstrapPeers = [
      '/dns4/teranode-bootstrap.bsvb.tech/tcp/9901/p2p/12D3KooWESmhNAN8s6NPdGNvJH3zJ4wMKDxapXKNUe2DzkAwKYqK'
    ],
    staticPeers = [
      // Active Teranode peers discovered from Go implementation
      '/dns4/teranode-mainnet-peer.taal.com/tcp/9905/p2p/12D3KooWJGPdPPw72GU6gFF4LqUjeFF7qmPCS2bZK8ywMvybYfXD',
      '/dns4/teranode-mainnet-us-01.bsvb.tech/tcp/9905/p2p/12D3KooWPJAHHaNy5BsViK1B5iTQmz5cLaUheAKEuNkHqMbwZ8jd',
      '/dns4/teranode-eks-mainnet-us-1-peer.bsvb.tech/tcp/9911/p2p/12D3KooWFjGChbwVteGsqH6NfHtKbtdW5XgnvmQRpem2kUAQjsGq',
      '/dns4/bsva-ovh-teranode-eu-1.bsvb.tech/tcp/9905/p2p/12D3KooWAdBeSVue71DTmfMEKyBG2s1hg91zJnze85rt2uKCZWbW',
      '/dns4/teranode-eks-mainnet-eu-1-peer.bsvb.tech/tcp/9911/p2p/12D3KooWRioUF2AYvC6ofiXhjE5V3MLiVrRKMAEyHiz5iYQgnB5f'
    ],
    sharedKey = '285b49e6d910726a70f205086c39cbac6d8dcc47839053a21b1f614773bbc137',
    dhtProtocolID = '/teranode',
    topics = [
      'bitcoin/mainnet-bestblock',
      'bitcoin/mainnet-block',
      'bitcoin/mainnet-subtree',
      'bitcoin/mainnet-mining_on',
      'bitcoin/mainnet-handshake',
      'bitcoin/mainnet-rejected_tx'
    ],
    listenAddresses = ['/ip4/127.0.0.1/tcp/9901'],
    usePrivateDHT = true
  } = config

  // Format the PSK
  const pskText = `/key/swarm/psk/1.0.0/\n/base16/\n${sharedKey}`
  const psk = new TextEncoder().encode(pskText)

  const connectionProtector = preSharedKey({ psk })

  const privateKey: PrivateKey = await generateKeyPair('Ed25519')

  const node = await createLibp2p({
    privateKey,
    addresses: {
      listen: listenAddresses
    },
    transports: [tcp()],
    connectionEncrypters: [noise()],
    streamMuxers: [yamux()],
    connectionProtector,
    peerDiscovery: [
      bootstrap({ list: bootstrapPeers }),
      pubsubPeerDiscovery({
        topics,
        interval: 5000
      })
    ],
    services: {
      dht: kadDHT({
        protocol: `${dhtProtocolID}/kad/1.0.0`,
        clientMode: false,
        validators: {},
        selectors: {}
      }),
      pubsub: gossipsub({
        allowPublishToZeroTopicPeers: true,
        emitSelf: false,
        fallbackToFloodsub: true,
        floodPublish: true,
        doPX: true
      }),
      identify: identify(),
      ping: ping()
    }
  })

  await node.start()
  console.log('Libp2p node started with Peer ID:', node.peerId.toString())

  // Event listeners for logging
  node.addEventListener('peer:discovery', evt => {
    console.log('Peer discovered:', evt.detail.id.toString())
    console.log(
      'Peer multiaddrs:',
      evt.detail.multiaddrs.map(ma => ma.toString())
    )
  })

  node.addEventListener('peer:connect', evt => {
    console.log('✅ Peer connected:', evt.detail.toString())
    console.log('Total connected peers:', node.getPeers().length)
  })

  node.addEventListener('peer:disconnect', evt => {
    console.log('❌ Peer disconnected:', evt.detail.toString())
    console.log('Remaining connected peers:', node.getPeers().length)
  })

  // Subscribe to topics and handle messages
  // node.services.pubsub.addEventListener('gossipsub:message', (evt) => {
  //   const msg = evt.detail.msg;
  //   console.log(`[${msg.topic}] ${msg.data} - from: ${evt.detail.propagationSource}`);
  // });

  for (const topic of topics) {
    ;(node.services.pubsub as any).subscribe(topic)
    console.log(`Subscribed to topic: ${topic}`)
  }

  // Connect to static peers if provided
  let reconnectionInterval: NodeJS.Timeout | undefined
  if (staticPeers.length > 0) {
    await connectToStaticPeers(node, staticPeers)
    reconnectionInterval = startStaticPeerMonitoring(node, staticPeers)
  }

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('Shutting down...')
    if (reconnectionInterval) clearInterval(reconnectionInterval)
    await node.stop()
    process.exit(0)
  })
}

async function connectToStaticPeers(node: Libp2p, staticPeers: string[]) {
  const connectionPromises = staticPeers.map(async peerAddr => {
    try {
      console.log(`Attempting to connect to static peer: ${peerAddr}`)
      await node.dial(multiaddr(peerAddr))
      console.log(`✅ Successfully connected to static peer: ${peerAddr}`)
    } catch (error) {
      console.error(`❌ Failed to connect to static peer ${peerAddr}:`, error)
    }
  })

  await Promise.allSettled(connectionPromises)
  console.log(`Static peer connection complete. Total connected peers: ${node.getPeers().length}`)
}

function startStaticPeerMonitoring(node: Libp2p, staticPeers: string[]): NodeJS.Timeout {
  return setInterval(async () => {
    const connectedPeerIds = node.getPeers().map(p => p.toString())
    const disconnectedStaticPeers: string[] = []

    for (const staticPeer of staticPeers) {
      try {
        const peerIdMatch = staticPeer.match(/\/p2p\/([^/]+)$/)
        if (peerIdMatch) {
          const peerId = peerIdMatch[1]
          if (!connectedPeerIds.includes(peerId)) {
            disconnectedStaticPeers.push(staticPeer)
          }
        }
      } catch (error) {
        console.error(`Error checking static peer ${staticPeer}:`, error)
      }
    }

    if (disconnectedStaticPeers.length > 0) {
      console.log(`Reconnecting to ${disconnectedStaticPeers.length} disconnected static peers...`)
      await connectToStaticPeers(node, disconnectedStaticPeers)
    }
  }, 30000) // 30 seconds
}
