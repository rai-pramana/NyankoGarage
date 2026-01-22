import { Module, Global } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Global() // Make EventsGateway available globally without importing
@Module({
    providers: [EventsGateway],
    exports: [EventsGateway],
})
export class EventsModule { }
