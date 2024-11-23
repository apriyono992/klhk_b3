import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import { PrismaService } from './prisma.services';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from "axios";
import {RegistrasiServices} from "./registrasi.services";
import {RequestInswDto} from "../models/requestInswDto";
import { Response } from 'express';

@Injectable()
export class InswServices {

  private readonly apiUrl = 'https://apicatalogue.insw.go.id/sandbox?idLayanan=291';

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private registrasiService: RegistrasiServices
  ) {}


  async authorizationInsw() {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          process.env.INSW_URL.concat('/login-svc/oauth2/authorize'),
          {
            client_id: process.env.INSW_CLIENT_ID,
            response_type: 'code',
            scope: 'session',
            provision_key: process.env.INSW_PROVISION_KEY,
            authenticated_userid: process.env.INSW_USERID,
            redirect_uri: process.env.BASE_URL,
          },
        ),
      );

      console.log(
        response.data.redirect_uri.replace(
          process.env.BASE_URL.concat('?code='),
          '',
        ),
      );

      const res = await this.generateToken(
        response.data.redirect_uri.replace(
          process.env.BASE_URL.concat('?code='),
          '',
        ),
      );
      return res;
    } catch (error) {
      console.error(error);
    }
  }

  async generateToken(code: string) {
    const response = await axios.post(
      process.env.INSW_URL.concat('/login-svc/oauth2/token'),
      {
        grant_type: 'authorization_code',
        code: code,
        client_id: process.env.INSW_CLIENT_ID,
        client_secret: process.env.INSW_CLIENT_SECRET,
      },
    );
    return response.data;
  }

  async exportJson(payload: RequestInswDto, res: Response) {
    const data = await this.formatDataINSW(payload);
    const jsonData = JSON.stringify(data, null, 2);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=${payload.id}`);

    return res.send(Buffer.from(jsonData));
  }

  async sendInsw(payload: RequestInswDto) {

    const { access_token } = await this.authorizationInsw();

    const dataRegistrasi = await this.registrasiService.getRegistrasiById(payload.id);
    const dataB3Registrasi = await dataRegistrasi.BahanB3Registrasi;

    if(!dataRegistrasi){
      throw new NotFoundException("Can't find registrasi");
    }

    try {
        const responseData = await axios
            .post(
                process.env.INSW_URL.concat(
                    '/api/v1/services/transaksi/perizinan/send-izin',
                ),
                await this.formatDataINSW(payload),
                {
                  headers: {
                    'Content-Type': 'application/json', // Example header
                    Authorization: `Bearer ${access_token}`, // Authorization header
                  },
                },
            )

        await this.prisma.registrasi.update({
          where: { id: payload.id },
          data: {
            approval_status: payload.approval_status,
            status: payload.status,
          }
        })

        return responseData.data;

      } catch (er) {
      console.log(er, 'isi error')
      throw new HttpException(
          {
            status: er.response.data.data.kode,
            message: er.response.data.data.keterangan,
            error: 'Internal Server Error',
          },
          HttpStatus.BAD_REQUEST,
        )
    }

  }

  private formatDate(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2,
        '0');
    return `${year}-${month}-${day}`;

  }

   async formatDataINSW(payload) {

    const dataRegistrasi = await this.registrasiService.getRegistrasiById(payload.id);
    const dataB3Registrasi = await dataRegistrasi.BahanB3Registrasi;

     console.log(dataRegistrasi, " check dataRegistrasi")

    const data = {
      header: {
        urlKep: "https://www.google.com/",
        ketTolak: "",
        msBerlaku: "",
        kdInstansi: "30",
        keterangan: "-",
        narahubung: {
          nama: dataRegistrasi.nama_pengurus,
          jabatan:  dataRegistrasi.jabatan_pengurus,
          identitas: "197704222008011008"
        },
        urlKendali: "",
        kdKeputusan: "",
        kdPerijinan: "0130001",
        noPengajuan: "",
        noPerijinan: dataRegistrasi.nomor,
        urPerijinan: "",
        jnsPengajuan: payload.jnsPengajuan,
        jnsPerijinan: "2",
        tglKeputusan: "2022-03-03",
        tglPengajuan: "",
        tglPerijinan:  this.formatDate(dataRegistrasi.tanggal_terbit.toISOString()),
        noPengajuanKL: "SH2022-1-001012",
        tglPengajuanKL: this.formatDate(dataRegistrasi.tanggal_pengajuan.toISOString()),
        tglAwalPerijinan: this.formatDate(dataRegistrasi.berlaku_dari.toISOString()),
        tglAkhirPerijinan: this.formatDate(dataRegistrasi.berlaku_sampai.toISOString())
      },
      proses: [
        {
          kdStatus: "",
          urStatus: "",
          wkStatus: "",
          idPetugas: "",
          nmPetugas: ""
        }
      ],
      trader: {
        narahubung: {
          kota: dataRegistrasi.company.kota,
          nama: dataRegistrasi.company.penanggungJawab,
          skalaUsaha: "JU.1",
          noID: "926414483444000",
          npwp: dataRegistrasi.company.npwp,
          jnsID: "5",
          kdPos: dataRegistrasi.company.kdPos,
          alamat: dataRegistrasi.company.alamatKantor,
          provinsi: dataRegistrasi.company.provinsi
        }
      },
      komoditas: dataB3Registrasi.map((dataReg, index) => {
        return {
          noHS:"",
          netto: null,
          noCAS: dataReg.cas_number,
          serial: index + 1, //Mandatory
          volume: null,
          negAsal: [],
          negMuat: [],
          nmLatin: "",
          noBatch: null,
          periode: [],
          plbAsal: [],
          plbMuat: [],
          sediaan: "",
          urBarang: dataReg.nama_dagang, //Mandatory
          jmlSatuan: null,
          jnsProduk: dataReg.nama_bahan, //Mandatory
          jnsSatuan: "",
          plbTujuan: [],
          negTransit: [],
          plbTransit: [],
          spekBarang: "",
          deskripsiHS: "",
          flagPerubahan: "",
        }
      }),
      referensi: [
        {
          kdDok: "",
          noDok: "",
          jnsDok: "",
          tglDok: "",
          urlDok: "",
          penerbit: "",
          negPenerbit: ""
        },
      ],
      standardSLA: "",
      transportasi: {
        moda: {
          tglTiba: "",
          angkutNo: "",
          angkutNama: ""
        },
        lokasi: {
          negAsal: [
            "ID"
          ],
          negMuat: [
            "ID"
          ],
          plbAsal: [
            "IDTPP"
          ],
          plbMuat: [
            "IDTPP",
            "IDBLW"
          ],
          negTujuan: [
            "CN",
            "SG"
          ],
          plbTujuan: [
            "CNCGS"
          ],
          negTransit: [
            "SG"
          ],
          plbTransit: [
            "SGCHG"
          ]
        },
        tmpTimbun: "",
        tmptInstalasi: {
          nama: "",
          alamat: ""
        }
      }
    }
    return data;

  }
}
