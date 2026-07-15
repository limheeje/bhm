import {defineWebSocketHandler} from 'h3'

export default defineWebSocketHandler({
  open(peer) {
    startLiveAuctionSimulation()
    registerPeer(peer)
  },
  message(peer, message) {
    try {
      const data = message.json<{type: string; payload: {lotId: string; price: number}}>()
      if (data.type === 'BID') {
        const result = placeBid(data.payload.lotId, data.payload.price, '나(중도매인)')
        if (!result.success) {
          peer.send(JSON.stringify({type: 'BID_REJECTED', payload: {message: result.message}}))
        }
      }
    } catch (err) {
      console.log(err)
    }
  },
  close(peer) {
    unregisterPeer(peer)
  }
})
