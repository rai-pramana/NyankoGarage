import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*', // Allow all origins for now
        credentials: false,
    },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private logger = new Logger('EventsGateway');

    handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    // Emit events to all connected clients
    emitDataChange(event: string, data?: any) {
        this.logger.log(`Emitting ${event}`);
        this.server.emit(event, data);
    }

    // Specific event emitters
    emitTransactionChange() {
        this.emitDataChange('transaction:change');
    }

    emitInventoryChange() {
        this.emitDataChange('inventory:change');
    }

    emitProductChange() {
        this.emitDataChange('product:change');
    }

    emitDashboardChange() {
        this.emitDataChange('dashboard:change');
    }

    emitUserChange() {
        this.emitDataChange('user:change');
    }
}
