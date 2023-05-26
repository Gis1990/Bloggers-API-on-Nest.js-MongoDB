import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetTelegramBotLinkCommand } from "../../commands/telegram/get-telegram-bot-link";
import { TelegramPayloadProcessingCommand } from "../../commands/telegram/telegram-payload-processing-use-case";

@SkipThrottle()
@Controller("integrations/telegram")
export class IntegrationsController {
    constructor(private commandBus: CommandBus) {}

    @Post("webhook")
    @HttpCode(204)
    async forTelegramHook(@Body() payload: any): Promise<boolean> {
        return await this.commandBus.execute(new TelegramPayloadProcessingCommand(payload));
    }

    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("auth-bot-link")
    async getLink(@CurrentUser() user: CurrentUserModel): Promise<{ link: string }> {
        return await this.commandBus.execute(new GetTelegramBotLinkCommand(user.id));
    }
}
