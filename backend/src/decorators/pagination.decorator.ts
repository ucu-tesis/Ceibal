import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { page, pageSize } = ctx.switchToHttp().getRequest().query;

    return {
      page: Number(page) || 0,
      pageSize: Number(pageSize) || 20,
    };
  },
);
