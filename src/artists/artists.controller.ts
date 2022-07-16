import { Controller } from "@nestjs/common";
import { ArtistsService } from "./artists.service";

@Controller('artist')
export class ArtistsController {
    constructor(private readonly artistsService: ArtistsService) {}}