import { Session } from '../../../session/entities/session.entity';

export type JwtRefreshPayloadType = {
  sessionId: Session['id'];
  hash: Session['hash'];
  iat: number;
  exp: number;
};
