import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // If 'data' is provided, return a specific field (e.g., 'email', 'id')
    return data ? user?.[data] : user;
  },
);
