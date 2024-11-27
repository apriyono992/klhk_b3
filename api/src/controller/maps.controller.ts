import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {Controller, Get} from "@nestjs/common";
import { PenyimpananB3Service } from '../services/penyimpananB3.service';
import {SuccessRes} from "../utils/responseDto";
import {RegistrasiServices} from "../services/registrasi.services";
import {MapsServices} from "../services/maps.services";

@ApiTags('MAPS')
@Controller('maps')
export class MapsControllers{
    constructor(
        private readonly mapsServices: MapsServices
    ) {
    }
    @Get("/gudang-penyimpanan-b3")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async listDataGudangPenyimpanan4Maps(){
        const res = await this.mapsServices.listDataGudangPenyimpanan4Maps()
        return new SuccessRes("list data gudang penyimpanan",res)
    }
    @Get("/pelabuhan-b3")
    @ApiResponse({
        status: 200,
        description: 'list data gudang penyimpanan',
    })
    async getDataPelabuhan(){
        const res = await this.mapsServices.getDataPelabuhan()
        return new SuccessRes("list data pelabuhan",res)
    }
}