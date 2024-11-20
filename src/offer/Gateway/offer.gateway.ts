import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage, 
    MessageBody 
  } from '@nestjs/websockets';
  
  import { Server } from 'socket.io';
import { OfferService } from '../services/offer.service';
  
  @WebSocketGateway({
    namespace: 'offer',
    cors: {
      origin: true,
      credentials: true,
    },
  })
  export class OfferGateway {
    constructor(private readonly offerService: OfferService) {}
  
    @WebSocketServer()
    server: Server;
  
    @SubscribeMessage('newOffer')
    async handleNewOffer(@MessageBody() data: { enchereId: number }) {
      const offers = await this.offerService.getOffersByEnchere(data.enchereId);
      // Envoyer à tous les clients connectés une mise à jour des offres
      this.server.emit('offerUpdate', offers);
    }
  
    @SubscribeMessage('getWinner')
    async handleGetWinner(@MessageBody() data: { enchereId: number }) {
      const winner = await this.offerService.getWinnerOffer(data.enchereId);
      // Envoyer l'offre gagnante aux clients
      this.server.emit('winnerUpdate', winner);
    }
  }
  