import { ApiProperty } from "@nestjs/swagger";

export class AccessTokenClass {
    @ApiProperty({ type: String, description: "The Id of the blog" })
    accessToken: string;

    constructor(accessToken: string) {
        this.accessToken = accessToken;
    }
}
