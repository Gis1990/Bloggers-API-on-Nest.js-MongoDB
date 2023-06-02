import { Body, Controller, Get, HttpCode, Post, UseGuards } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAccessTokenAuthGuard } from "../../guards/jwtAccessToken-auth.guard";
import { CurrentUser } from "../../decorators/auth/auth.custom.decorators";
import { CurrentUserModel } from "../../dtos/auth.dto";
import { GetTelegramBotLinkCommand } from "../../commands/telegram/get-telegram-bot-link";
import { TelegramPayloadProcessingCommand } from "../../commands/telegram/telegram-payload-processing-use-case";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LinkForTelegramClass } from "../../dtos/users.dto";

@ApiTags("Telegram")
@SkipThrottle()
@Controller("integrations/telegram")
export class IntegrationsController {
    constructor(private commandBus: CommandBus) {}

    @ApiOperation({ summary: "Webhook for TelegramBot Api" })
    @ApiResponse({ status: 204, description: "No Content" })
    @Post("webhook")
    @HttpCode(204)
    async forTelegramHook(@Body() payload: any): Promise<boolean> {
        return await this.commandBus.execute(new TelegramPayloadProcessingCommand(payload));
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: "Get auth bot link with personal user code inside" })
    @ApiResponse({ status: 200, description: "Success", type: LinkForTelegramClass })
    @ApiResponse({ status: 401, description: "Unauthorized" })
    @UseGuards(JwtAccessTokenAuthGuard)
    @Get("auth-bot-link")
    async getLink(@CurrentUser() user: CurrentUserModel): Promise<LinkForTelegramClass> {
        return await this.commandBus.execute(new GetTelegramBotLinkCommand(user.id));
    }
}
